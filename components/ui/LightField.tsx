"use client"

import { useEffect, useRef } from "react"

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

// Teal fog with drifting coral light streaks, concentrated on the right.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

float streak(vec2 uv, float y, float x0, float x1, float h, float t, float seed) {
  float drift = 0.035 * sin(t * 0.35 + seed) + 0.02 * sin(t * 0.9 + seed * 3.0);
  float dy = (uv.y - y - 0.006 * sin(uv.x * 9.0 + t + seed)) / h;
  float vertical = exp(-dy * dy * 2.2);
  float left = smoothstep(x0 - 0.03 + drift, x0 + 0.05 + drift, uv.x);
  float right = 1.0 - smoothstep(x1 - 0.18 + drift, x1 + drift, uv.x);
  float grain = 0.75 + 0.25 * noise(vec2(uv.x * 40.0 - t * 2.0, seed));
  return vertical * left * right * grain;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // Teal fog, brighter behind the right-hand focal area.
  float fog = fbm(p * 1.3 + vec2(t * 0.02, -t * 0.015) + uPointer * 0.25);
  vec3 deep = vec3(0.02, 0.055, 0.05);
  vec3 teal = vec3(0.09, 0.27, 0.25);
  vec3 mist = vec3(0.29, 0.5, 0.47);
  float focus = exp(-pow(length((uv - vec2(0.7, 0.6)) * vec2(1.3, 1.0)) / 0.42, 2.0));
  vec3 col = mix(deep, teal, smoothstep(0.25, 0.85, fog) * 0.85 + focus * 0.35);
  col = mix(col, mist, focus * smoothstep(0.4, 0.9, fog) * 0.45);

  // Coral light streaks.
  vec3 coral = vec3(1.0, 0.33, 0.2);
    float s3 = streak(uv, 0.34, 0.8, 1.08, 0.045, t, 7.0) * 0.55;
  float light = s3;
  col = mix(col, coral, clamp(light * 0.85, 0.0, 0.9));

  // Warm haze at the bottom-right corner, like a light leak.
  float haze = exp(-pow(length((uv - vec2(1.02, 0.12)) * vec2(1.0, 1.6)) / 0.45, 2.0));
  col += vec3(0.9, 0.32, 0.2) * haze * (0.35 + 0.1 * sin(t * 0.4));

  // Keep the text side calm and dark.
  col = mix(col, deep, smoothstep(0.55, 0.05, uv.x) * 0.7);
  col *= mix(0.55, 1.0, smoothstep(1.25, 0.3, length((uv - vec2(0.62, 0.5)) * vec2(1.0, 1.25))));

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function LightField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, "uResolution")
    const uTime = gl.getUniformLocation(program, "uTime")
    const uPointer = gl.getUniformLocation(program, "uPointer")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let visible = true
    let frame = 0
    const start = performance.now() - 20000

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      canvas.dataset.ready = "true"
      if (!reduced && visible) frame = requestAnimationFrame(render)
    }

    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5
      pointer.ty = event.clientY / window.innerHeight - 0.5
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible"
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(render)
    })
    io.observe(canvas)
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointer, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
