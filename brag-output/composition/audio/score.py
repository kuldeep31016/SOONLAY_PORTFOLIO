"""Original score + sound design for the Soonlay brand film.

Reads scene durations from ../config.js so every hit lands on its visual cue.
Run:  python3 audio/score.py   (writes assets/audio/score.wav)

Arc: near-silent drone -> soft sub pulse (interface) -> tighter pulse + data
ticks (build) -> rising tension + whooshes (products) -> collapse to silence ->
warm low impact + open chord on the headline (peak) -> resolve + bell on CTA.
"""

import json
import pathlib
import re

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
cfg_src = (ROOT / "config.js").read_text()
FILM = json.loads(re.search(r"window\.FILM\s*=\s*(\{.*\})", cfg_src, re.S).group(1))

SR = 48000
S = {}
acc = 0.0
for sc in FILM["scenes"]:
    S[sc["id"]] = acc
    acc += sc["duration"]
END = acc
N = int(END * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)  # deterministic

L = np.zeros(N)
R = np.zeros(N)


def note(name):
    names = {"C": -9, "C#": -8, "D": -7, "Eb": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "Ab": -1, "A": 0, "Bb": 1, "B": 2}
    n, octv = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[n] + (octv - 4) * 12) / 12)


def env_adsr(n, a, r, sus=1.0):
    e = np.ones(n) * sus
    ai = max(1, int(a * SR))
    ri = max(1, int(r * SR))
    e[:ai] = np.linspace(0, sus, ai) if ai <= n else np.linspace(0, sus, n)[: n]
    if ri < n:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def add(sig, start, gain=1.0, pan=0.0):
    i0 = int(start * SR)
    if i0 >= N:
        return
    seg = sig[: N - i0] * gain
    l_g = np.cos((pan + 1) * np.pi / 4)
    r_g = np.sin((pan + 1) * np.pi / 4)
    L[i0 : i0 + len(seg)] += seg * l_g
    R[i0 : i0 + len(seg)] += seg * r_g


def lowpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype="low", fs=SR, output="sos"), x)


def highpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype="high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def ramp(points):
    """Piecewise-linear automation over the whole film. points=[(time, value), ...]"""
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)


# ---------------------------------------------------------------- drone
d_amp = ramp([(0, 0), (2.5, 0.55), (S["build"], 0.7), (S["brand"] - 0.4, 0.85), (S["brand"] - 0.05, 0.15),
              (S["brand"] + 0.75, 0.9), (S["cta"], 0.7), (END - 1.2, 0.5), (END, 0)])
lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.11 * t)
drone = (0.55 * np.sin(2 * np.pi * note("D2") / 2 * t)  # sub D1
         + 0.35 * np.sin(2 * np.pi * note("D2") * t + 0.3 * np.sin(2 * np.pi * 0.07 * t))
         + 0.18 * np.sin(2 * np.pi * note("A2") * t))
drone = lowpass(drone, 400) * d_amp * lfo * 0.5
add(drone, 0, 1.0, 0)

# ---------------------------------------------------------------- pad (chords per scene)
CHORDS = [
    (S["idea"], ["D3", "A3", "F4"]),
    (S["interface"], ["D3", "A3", "E4", "F4"]),
    (S["build"], ["Bb2", "F3", "A3", "D4"]),
    (S["products"], ["G2", "D3", "Bb3", "C4", "F4"]),
    (S["products"] + 2.7, ["A2", "E3", "G3", "D4", "E4"]),
    (S["brand"] + 0.75, ["D2", "A2", "F3", "C4", "E4", "A4"]),
    (S["cta"] + 1.4, ["F2", "C3", "A3", "E4", "G4"]),
]
bright = ramp([(0, 0.05), (S["build"], 0.25), (S["brand"] - 0.4, 0.5), (S["brand"] + 0.75, 0.9), (END, 0.6)])
pad_amp = ramp([(0, 0), (1.5, 0.25), (S["interface"], 0.35), (S["products"], 0.5), (S["brand"] - 0.4, 0.6),
                (S["brand"] - 0.05, 0.0), (S["brand"] + 0.7, 0.0), (S["brand"] + 1.4, 0.95), (S["cta"], 0.7), (END - 1.0, 0.45), (END, 0)])
pad = np.zeros(N)
for idx, (start, chord) in enumerate(CHORDS):
    stop = CHORDS[idx + 1][0] if idx + 1 < len(CHORDS) else END
    i0, i1 = int(start * SR), int(min(END, stop + 1.2) * SR)
    n = i1 - i0
    tt = np.arange(n) / SR
    seg = np.zeros(n)
    for nt in chord:
        f = note(nt)
        for det in (-0.12, 0.0, 0.11):  # soft detuned stack
            seg += np.sin(2 * np.pi * f * (1 + det / 100) * tt + rng.uniform(0, 6.28))
            seg += 0.18 * np.sin(2 * np.pi * 2 * f * tt)
    seg *= env_adsr(n, 0.9, 1.2) / (len(chord) * 3)
    pad[i0:i1] += seg
pad_dark = lowpass(pad, 700)
pad_bright = lowpass(pad, 3200)
pad_mix = (pad_dark * (1 - bright) + pad_bright * bright) * pad_amp
add(pad_mix, 0, 0.55, -0.15)
add(np.roll(pad_mix, int(0.013 * SR)), 0, 0.55, 0.15)

# ---------------------------------------------------------------- sub pulse + minimal percussion
BPM = 96
beat = 60 / BPM


def kick(dur=0.45, f0=95, f1=42):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 9)


def hat(dur=0.05):
    n = int(dur * SR)
    return highpass(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 90)


pulse_start = S["interface"] + 0.95
pulse_stop = S["brand"] - 0.4
tb = pulse_start
k = 0
while tb < pulse_stop:
    prog = (tb - pulse_start) / (pulse_stop - pulse_start)
    add(kick(), tb, 0.22 + 0.28 * prog, 0)
    if tb >= S["build"] + 0.9:
        add(hat(), tb + beat / 2, 0.035 + 0.05 * prog, 0.35 if k % 2 else -0.35)
    if tb >= S["products"] and k % 4 == 2:
        add(bandpass(rng.standard_normal(int(0.12 * SR)), 900, 3000) * np.exp(-np.arange(int(0.12 * SR)) / SR * 40), tb, 0.05, 0.2)
    tb += beat
    k += 1

# ---------------------------------------------------------------- UI sound design


def tick(freq=3400, dur=0.03, decay=140):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(2 * np.pi * freq * 2.01 * tt)) * np.exp(-tt * decay)


def click(freq=1800):
    n = int(0.05 * SR)
    tt = np.arange(n) / SR
    noise = bandpass(rng.standard_normal(n), freq * 0.7, freq * 1.6) * np.exp(-tt * 180)
    return 0.6 * noise + 0.4 * np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 120)


def whoosh(dur=0.7, up=False, lo=300, hi=4000):
    n = int(dur * SR)
    tt = np.linspace(0, 1, n)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    steps = 24
    for s in range(steps):
        a, b = s * n // steps, (s + 1) * n // steps
        frac = (s + 0.5) / steps
        fc = lo + (hi - lo) * (frac if up else 1 - frac)
        out[a:b] = bandpass(x[a:b], fc * 0.6, min(fc * 1.6, 20000))
    shape = np.sin(np.pi * tt) ** 1.5
    return out * shape


def boom(dur=2.2):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = 38 + 30 * np.exp(-tt * 6)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    air = lowpass(rng.standard_normal(n), 900) * np.exp(-tt * 5) * 0.35
    return body + air


def bell(freq, dur=3.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    partials = [(1, 1.0, 1.4), (2.76, 0.35, 2.6), (5.4, 0.12, 4.0), (8.93, 0.05, 6.0)]
    return sum(a * np.sin(2 * np.pi * freq * m * tt) * np.exp(-tt * dcy) for m, a, dcy in partials) * (1 - np.exp(-tt * 400))


a, b, c, d, e, f = (S[k] for k in ("idea", "interface", "build", "products", "brand", "cta"))

# Scene 1 — spark shimmer and the first line
add(tick(5200, 0.4, 9) * 0.5, a + 0.25, 0.05, 0)
add(whoosh(1.2, up=True, lo=800, hi=6000), a + 1.95, 0.05, 0)
add(tick(2600), a + 2.0, 0.07, 0)
# Scene 2 — interface assembles
add(whoosh(0.8, lo=400, hi=2500), b - 0.2, 0.06, 0)
for i, o in enumerate([1.05, 1.25, 1.45, 1.6, 1.76, 1.92, 2.0, 2.15]):
    add(click(1600 + 180 * (i % 3)), b + o, 0.10, (-0.3 + 0.1 * i) % 0.6 - 0.3)
for i in range(5):
    add(tick(3000 + 200 * i, 0.025), b + 2.35 + 0.1 * i, 0.045, 0.25)
add(whoosh(1.0, lo=200, hi=1800), b + 2.65, 0.08, 0.5)  # phone slides in
for i in range(3):
    add(click(2100), b + 3.1 + 0.12 * i, 0.06, 0.5)
# Scene 3 — the build
add(whoosh(1.3, lo=120, hi=1200), c - 0.1, 0.12, 0)
add(kick(0.6, 70, 38), c + 0.75, 0.25, -0.1)
add(kick(0.6, 65, 36), c + 1.05, 0.25, 0.1)
for i in range(3):
    add(tick(1400, 0.08, 40), c + 1.3 + i * 1.0, 0.09, 0)
for o in (0, 1.1, 2.2):
    for off, pan in ((2.0, -0.2), (2.4, 0.3), (2.65, 0)):
        add(tick(4200, 0.02, 200), c + off + o, 0.03, pan)
# Scene 4 — products morph
seg = next(sc["duration"] for sc in FILM["scenes"] if sc["id"] == "products") / 4.1
add(whoosh(0.9, lo=300, hi=3000), d - 0.05, 0.08, 0)
for i in range(1, 4):
    add(whoosh(0.75, lo=250, hi=3500), d + i * seg - 0.25, 0.1, -0.3 if i % 2 else 0.3)
    add(click(1300), d + i * seg + 0.05, 0.07, 0)
# Collapse into the spark, then silence
col = e - 0.35
add(whoosh(0.6, up=True, lo=500, hi=9000), col - 0.05, 0.1, 0)
add(tick(6000, 0.5, 8) * 0.6, col + 0.35, 0.05, 0)
# Scene 5 — the peak on the headline
add(boom(), e + 0.75, 0.55, 0)
add(bell(note("A4"), 3.5), e + 0.75, 0.05, -0.2)
add(bell(note("E5"), 3.0), e + 0.93, 0.03, 0.2)
# Scene 6 — CTA
add(tick(2200, 0.3, 12), f + 0.15, 0.04, 0)
add(kick(0.8, 60, 34), f + 1.4, 0.18, 0)
add(bell(note("A5"), 2.6), f + 2.05, 0.06, 0.1)

# ---------------------------------------------------------------- space, master
def reverb(x, seconds=2.2, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir = lowpass(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    return fftconvolve(x, ir)[: len(x)]


wetL, wetR = reverb(L, seed=3), reverb(R, seed=4)
outL = L * 0.8 + wetL * 0.35
outR = R * 0.8 + wetR * 0.35
master = ramp([(0, 1), (END - 1.4, 1), (END - 0.05, 0), (END, 0)])
out = np.stack([outL * master, outR * master], axis=1)
out = highpass(out.T, 28).T  # remove DC/rumble below hearing
peak = np.max(np.abs(out))
out = out / peak * 0.89  # about -1 dBFS peak
out_path = ROOT / "assets" / "audio" / "score.wav"
out_path.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out_path, SR, (out * 32767).astype(np.int16))
rms = 20 * np.log10(np.sqrt(np.mean(out ** 2)))
print(f"wrote {out_path} ({END:.1f}s, RMS {rms:.1f} dBFS)")
