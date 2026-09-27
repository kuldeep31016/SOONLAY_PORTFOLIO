"use client"

import { useEffect, useRef } from "react"

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

// Flowing "silk under studio light" field. Warm espresso base, amber and gold folds.
const FRAGMENT = `
precision mediump float;
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
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.6 + 3.0 * q + vec2(1.7 - t, 9.2)), fbm(p * 1.6 + 3.0 * q + vec2(8.3, 2.8 + t)));
  float f = fbm(p * 1.3 + 2.6 * r + uPointer * 0.35);

  float folds = smoothstep(0.35, 0.95, f);
  float sheen = pow(smoothstep(0.55, 1.0, f + 0.25 * r.x), 3.0);

  vec3 base = vec3(0.071, 0.059, 0.035);
  vec3 amber = vec3(0.42, 0.30, 0.07);
  vec3 gold = vec3(0.95, 0.76, 0.19);
  vec3 cream = vec3(0.98, 0.93, 0.80);

  vec3 col = mix(base, amber, folds * 0.85);
  col = mix(col, gold, sheen * 0.75);
  col += cream * pow(sheen, 2.5) * 0.35;

  // Keep the centre (where text sits) calmer and darker.
  float textShade = smoothstep(0.55, 0.0, length((uv - vec2(0.5, 0.52)) * vec2(1.0, 1.35))) * 0.6;
  col = mix(col, base, textShade);

  float vig = smoothstep(1.25, 0.25, length((uv - vec2(0.5, 0.5)) * vec2(1.0, 1.3)));
  col *= mix(0.55, 1.0, vig);

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

export function SilkBackground({ className }: { className?: string }) {
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
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6
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
