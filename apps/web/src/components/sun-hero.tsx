'use client'

import { useEffect, useRef } from 'react'

const VERT = `
  attribute vec2 pos;
  void main() {
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`

const FRAG = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;

  void main() {
    vec2 FC = gl_FragCoord.xy;
    float t = u_time * 0.7;
    vec2 r = u_res;
    vec2 p = (FC * 2.0 - r) / r.y;
    p *= 1.3;
    vec3 c = vec3(0.0);

    for (float i = 0.0; i < 42.0; i++) {
      float a = i / 1.5 + t * 0.5;
      vec2 q = p;
      q.x = q.x + sin(q.y * 19.0 + t * 2.0 + i) *
            29.0 * smoothstep(0.0, -2.0, q.y);
      float d = length(q - vec2(cos(a), sin(a)) *
                       (0.4 * smoothstep(0.0, 0.5, -q.y)));
      c = c + vec3(0.34, 0.30, 0.24) * (0.015 / d);
    }

    vec3 col = c * c + 0.05;
    gl_FragColor = vec4(col, 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const msg = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(msg || 'Shader compilation failed')
  }
  return s
}

function linkProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.bindAttribLocation(p, 0, 'pos')
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || 'Program link failed')
  }
  return p
}

/**
 * Fullscreen WebGL GLSL sun/sphere animation.
 * Dark background, works on both light & dark themes.
 */
export function SunHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    // Resize handler
    function resize() {
      if (!canvas || !gl) return
      const d = window.devicePixelRatio || 1
      canvas.width = innerWidth * d
      canvas.height = innerHeight * d
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // Compile & link
    let program: WebGLProgram
    try {
      const vs = compileShader(gl, VERT, gl.VERTEX_SHADER)
      const fs = compileShader(gl, FRAG, gl.FRAGMENT_SHADER)
      program = linkProgram(gl, vs, fs)
    } catch (e) {
      console.error('WebGL shader error:', e)
      return
    }

    gl.useProgram(program)

    // Fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')

    const start = performance.now()

    function draw() {
      if (!gl || !canvas) return
      const t = (performance.now() - start) * 0.001
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full"
      style={{ background: '#000' }}
    />
  )
}
