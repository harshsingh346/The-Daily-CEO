"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type HarpCoilRotate = "auto" | "up" | "right" | "down" | "left"
export type HarpCoilMirror = "none" | "horizontal" | "vertical" | "both"
export type HarpCoilFlow = "off" | "forward" | "reverse"
export type HarpCoilSway = "forward" | "reverse"
export type HarpCoilColorMode = "single" | "gradient"

export interface HarpCoilDirection {
    rotate: HarpCoilRotate

    mirror: HarpCoilMirror

    flow: HarpCoilFlow

    sway: HarpCoilSway
}

export interface HarpCoilProps {
    background?: string

    lineColor?: string

    colorMode?: HarpCoilColorMode

    color2?: string

    color3?: string

    lines?: number

    lineWeight?: number

    depth?: number
    direction?: Partial<HarpCoilDirection>

    hover?: number

    speed?: number

    drift?: number

    zoom?: number
    style?: CSSProperties
}

const DEFAULT_BACKGROUND = "#000000"
const DEFAULT_LINE_COLOR = "#50DCF2"
const DEFAULT_LINES = 24
const DEFAULT_LINE_WEIGHT = 5
const DEFAULT_DEPTH = 5
const DEFAULT_COLOR_MODE: HarpCoilColorMode = "single"
const DEFAULT_COLOR_2 = "#8A6CFF"
const DEFAULT_COLOR_3 = "#FF5FC8"

const DEFAULT_DIRECTION: HarpCoilDirection = {
    rotate: "auto",
    mirror: "none",
    flow: "off",
    sway: "forward",
}
const DEFAULT_HOVER = 5
const DEFAULT_SPEED = 5
const DEFAULT_DRIFT = 4
const DEFAULT_ZOOM = 100

const MAX_DPR = 2

const POINTER_EASE = 6

const REDUCED_MOTION_RATE = 0.25

const REF_W = 736
const REF_H = 1308

const SEGS = 6
const BAND_COUNT = 6

const MAX_SQUASH = 1.2

interface BandDef {
    knots: readonly number[]

    lines: number

    pitch: number

    fan: number

    ramp: readonly [number, number]

    gain: readonly [number, number]

    echo: boolean
    phase: number
}

const BANDS: readonly BandDef[] = [

    { knots: [-90, -90, 40, 5, 155, 95, 192, 235, 155, 400, 45, 540, -90, 650], lines: 23, pitch: 6.3, fan: 1.1, ramp: [0.5, 0.9], gain: [1, 0.34], echo: false, phase: 0 },
    { knots: [-90, 100, 40, 195, 155, 285, 192, 425, 150, 575, 40, 695, -90, 800], lines: 20, pitch: 7, fan: 1, ramp: [0, 1], gain: [0.15, 0.1], echo: true, phase: 0 },

    { knots: [900, -140, 635, 95, 458, 315, 384, 545, 465, 735, 650, 840, 890, 870], lines: 22, pitch: 6, fan: 1.5, ramp: [0.5, 0.85], gain: [0.9, 0.1], echo: false, phase: 2.1 },
    { knots: [950, -40, 740, 180, 575, 400, 395, 690, 470, 940, 650, 1080, 890, 1140], lines: 20, pitch: 7, fan: 1.45, ramp: [0.4, 0.8], gain: [0.17, 0.03], echo: true, phase: 2.1 },

    { knots: [-140, 845, 50, 835, 210, 860, 335, 935, 400, 1055, 410, 1200, 400, 1440], lines: 23, pitch: 9.3, fan: 0.73, ramp: [0.3, 0.8], gain: [0.22, 0.03], echo: false, phase: 4.2 },
    { knots: [-160, 1075, 30, 1065, 190, 1090, 315, 1165, 380, 1285, 390, 1430, 380, 1670], lines: 22, pitch: 9.3, fan: 0.73, ramp: [0.3, 0.8], gain: [0.07, 0.03], echo: true, phase: 4.2 },
]

const LOOK = {
    sigma: 0.13,

    tone: 2.83,

    loopS: 12,

    swayPx: 45,

    swayStep: 0.35,

    breathe: 0.06,

    echoLagS: 0.8,

    flowRate: 0.25,
    flowWaves: 3,

    flowSkew: 0.015,

    flowPeak: 1.6,
    flowDip: 0.35,

    paletteStep: 0.33,

    hoverRadius: 0.25,
    hoverPush: 0.37,
    hoverGlow: 0.3,
}

const SWAY_ENV = [0, 0.6, 0.9, 1, 0.9, 0.6, 0]

const ROTATE_TURNS: Record<Exclude<HarpCoilRotate, "auto">, number> = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
}

interface LayoutInput {
    width: number
    height: number
    time: number
    lines: number
    depth: number
    drift: number
    zoom: number
    direction: HarpCoilDirection
}

interface Layout {
    cp: Float32Array

    box: Float32Array

    band: Float32Array

    shape: Float32Array
}

function createLayout(): Layout {
    return {
        cp: new Float32Array(BAND_COUNT * SEGS * 8),
        box: new Float32Array(BAND_COUNT * 4),
        band: new Float32Array(BAND_COUNT * 4),
        shape: new Float32Array(BAND_COUNT * 4),
    }
}

const KX = new Float64Array(SEGS + 3)
const KY = new Float64Array(SEGS + 3)

function layoutBands(out: Layout, i: LayoutInput): void {
    const W = Math.max(1, i.width)
    const H = Math.max(1, i.height)
    const dir = i.direction

    const turns =
        dir.rotate === "auto" || !(dir.rotate in ROTATE_TURNS)
            ? W > H ? 1 : 0
            : ROTATE_TURNS[dir.rotate]
    const flipX = dir.mirror === "horizontal" || dir.mirror === "both"
    const flipY = dir.mirror === "vertical" || dir.mirror === "both"
    const sideways = turns % 2 === 1
    const cw = sideways ? REF_H : REF_W
    const ch = sideways ? REF_W : REF_H
    let sx = W / cw
    let sy = H / ch
    if (sx > sy) sy = Math.max(sy, sx / MAX_SQUASH)
    else sx = Math.max(sx, sy / MAX_SQUASH)
    const z = i.zoom / 100
    sx *= z
    sy *= z
    const ox = (W - cw * sx) / 2
    const oy = (H - ch * sy) / 2
    const unit = Math.sqrt(sx * sy)

    const w = (Math.PI * 2) / LOOK.loopS
    const amp = (i.drift / 10) * LOOK.swayPx
    const depthK = i.depth / 5
    const echoMul = Math.max(0, 2 - depthK)
    const lineK = i.lines / DEFAULT_LINES

    for (let b = 0; b < BAND_COUNT; b++) {
        const d = BANDS[b]
        const lag = d.echo ? LOOK.echoLagS : 0
        const sign = dir.sway === "reverse" ? -1 : 1
        const t = sign * (i.time - lag)

        const t0 = sign * -lag

        for (let k = 0; k <= SEGS; k++) {
            let x = d.knots[k * 2]
            let y = d.knots[k * 2 + 1]

            const env = SWAY_ENV[k]
            const ph = d.phase + k * LOOK.swayStep
            x += amp * env * (Math.sin(w * t + ph) - Math.sin(w * t0 + ph))
            y += amp * env * (Math.cos(w * t + ph + 1.3) - Math.cos(w * t0 + ph + 1.3))
            let u = x
            let v = y
            if (turns === 1) {
                u = REF_H - y
                v = x
            } else if (turns === 2) {
                u = REF_W - x
                v = REF_H - y
            } else if (turns === 3) {
                u = y
                v = REF_W - x
            }

            if (flipX) u = cw - u
            if (flipY) v = ch - v
            KX[k + 1] = ox + u * sx
            KY[k + 1] = H - (oy + v * sy)
        }
        KX[0] = 2 * KX[1] - KX[2]
        KY[0] = 2 * KY[1] - KY[2]
        KX[SEGS + 2] = 2 * KX[SEGS + 1] - KX[SEGS]
        KY[SEGS + 2] = 2 * KY[SEGS + 1] - KY[SEGS]

        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        for (let s = 0; s < SEGS; s++) {
            const a = s + 1
            const pts = [
                KX[a], KY[a],
                KX[a] + (KX[a + 1] - KX[a - 1]) / 6, KY[a] + (KY[a + 1] - KY[a - 1]) / 6,
                KX[a + 1] - (KX[a + 2] - KX[a]) / 6, KY[a + 1] - (KY[a + 2] - KY[a]) / 6,
                KX[a + 1], KY[a + 1],
            ]
            for (let p = 0; p < 8; p += 2) {
                out.cp[(b * SEGS + s) * 8 + p] = pts[p]
                out.cp[(b * SEGS + s) * 8 + p + 1] = pts[p + 1]
                minX = Math.min(minX, pts[p])
                maxX = Math.max(maxX, pts[p])
                minY = Math.min(minY, pts[p + 1])
                maxY = Math.max(maxY, pts[p + 1])
            }
        }

        const n = Math.max(2, Math.round(d.lines * lineK))
        const breathe =
            1 +
            LOOK.breathe *
                (Math.sin(w * t + d.phase + Math.PI) - Math.sin(w * t0 + d.phase + Math.PI))

        const gap = ((d.pitch * d.lines) / n) * unit * breathe

        const reach = W + H
        for (const [a, c] of [[1, 2], [SEGS + 1, SEGS]]) {
            const dx = KX[a] - KX[c]
            const dy = KY[a] - KY[c]
            const len = Math.hypot(dx, dy) || 1
            const ex = KX[a] + (dx / len) * reach
            const ey = KY[a] + (dy / len) * reach
            minX = Math.min(minX, ex)
            maxX = Math.max(maxX, ex)
            minY = Math.min(minY, ey)
            maxY = Math.max(maxY, ey)
        }
        const pad = (n * 0.5 + 1) * gap * Math.max(1, d.fan)
        out.box.set([minX - pad, minY - pad, maxX + pad, maxY + pad], b * 4)

        const lead = d.echo ? echoMul : 1
        const g0 = d.gain[0] * lead
        const g1 = d.gain[0] * Math.pow(d.gain[1] / d.gain[0], depthK) * lead
        out.band.set([g0, g1, n, gap], b * 4)
        out.shape.set([d.fan, d.ramp[0], d.ramp[1], 0], b * 4)
    }
}

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg;
uniform float uBgAlpha;
uniform vec3 uLine;
uniform vec3 uLine2;
uniform vec3 uLine3;
uniform float uMulti;
uniform vec2 uFlow;
uniform float uSigma;
uniform float uTone;
uniform vec3 uLens;
uniform vec4 uCP[${(BAND_COUNT * SEGS * 8) / 4}];
uniform vec4 uBox[${BAND_COUNT}];
uniform vec4 uBand[${BAND_COUNT}];
uniform vec4 uShape[${BAND_COUNT}];
out vec4 outColor;

const int SEGS = ${SEGS};

vec3 palette(float t) {
    float p = 1.0 - abs(1.0 - mod(t, 2.0));
    return p < 0.5 ? mix(uLine, uLine2, p * 2.0) : mix(uLine2, uLine3, p * 2.0 - 1.0);
}

vec2 cp(int i) { vec4 v = uCP[i >> 1]; return (i & 1) == 0 ? v.xy : v.zw; }

void curve(int base, float T, out vec2 B, out vec2 D, out vec2 DD) {
    int s = clamp(int(floor(T)), 0, SEGS - 1);
    float t = T - float(s);
    int i = base + s * 4;
    vec2 a = cp(i), b = cp(i + 1), c = cp(i + 2), d = cp(i + 3);
    float m = 1.0 - t;
    B = m * m * m * a + 3.0 * m * m * t * b + 3.0 * m * t * t * c + t * t * t * d;
    D = 3.0 * m * m * (b - a) + 6.0 * m * t * (c - b) + 3.0 * t * t * (d - c);
    DD = 6.0 * m * (c - 2.0 * b + a) + 6.0 * t * (d - 2.0 * c + b);
}

void main() {
    vec2 frag = gl_FragCoord.xy;
    float mn = max(min(uRes.x, uRes.y), 1.0);
    vec2 dv = frag - uMouse * uRes;
    float R = uLens.x * mn;
    float fall = exp(-dot(dv, dv) / max(R * R, 1e-4)) * uHover;
    vec2 p = frag - dv * uLens.y * fall;

    float light = 0.0;
    vec3 tint = vec3(0.0);
    for (int r = 0; r < ${BAND_COUNT}; r++) {
        vec4 bx = uBox[r];
        if (p.x < bx.x || p.y < bx.y || p.x > bx.z || p.y > bx.w) continue;
        int base = r * SEGS * 4;
        vec2 B, D, DD;

        float T = 0.0;
        float best = 1e20;
        for (int k = 0; k <= SEGS * 4; k++) {
            float tk = float(k) * 0.25;
            curve(base, tk, B, D, DD);
            vec2 q = B - p;
            float d2 = dot(q, q);
            if (d2 < best) { best = d2; T = tk; }
        }
        for (int it = 0; it < 5; it++) {
            curve(base, T, B, D, DD);
            vec2 q = B - p;
            float f = dot(q, D);
            float fp = dot(D, D) + dot(q, DD);
            fp = fp > 1e-6 ? fp : max(dot(D, D), 1e-6);
            T = clamp(T - clamp(f / fp, -0.5, 0.5), 0.0, float(SEGS));
        }
        curve(base, T, B, D, DD);
        vec2 q = p - B;

        float dist = (D.x * q.y - D.y * q.x) / max(length(D), 1e-6);

        vec4 bd = uBand[r];
        float s = T / float(SEGS);
        vec4 sh = uShape[r];
        float gap = max(bd.w * mix(1.0, sh.x, smoothstep(sh.y, sh.z, s)), 1e-3);
        float n = bd.z;
        float x = dist / gap + (n - 1.0) * 0.5;
        if (x < -1.0 || x > n) continue;
        float k = clamp(floor(x + 0.5), 0.0, n - 1.0);
        float f = (x - k) * gap;

        float sig0 = uSigma * gap;
        float sig = max(sig0, 0.6);
        float prof = exp(-0.5 * f * f / (sig * sig)) * (sig0 / sig);
        float g = mix(bd.x, bd.y, s);

        float wave = 0.5 + 0.5 * cos(6.2831853 * (s * ${LOOK.flowWaves.toFixed(1)} - uFlow.y + k * ${LOOK.flowSkew}));
        g *= 1.0 + uFlow.x * (${LOOK.flowPeak} * pow(wave, 6.0) - ${LOOK.flowDip});
        float l = g * prof;
        light += l;

        tint += palette(s * 1.5 - 0.2 + float(r / 2) * ${LOOK.paletteStep} - uFlow.y / ${LOOK.flowWaves.toFixed(1)}) * l;
    }
    light *= 1.0 + uLens.z * fall;

    vec3 hue = uMulti > 0.5 ? tint / max(light, 1e-5) : uLine;
    vec3 glow = hue * (1.0 - exp(-uTone * light)) / (1.0 - exp(-uTone));

    float a = clamp(max(uBgAlpha, max(glow.r, max(glow.g, glow.b))), 0.0, 1.0);
    vec3 rgb = 1.0 - (1.0 - uBg * uBgAlpha) * (1.0 - glow);
    outColor = vec4(min(rgb, vec3(a)), a);
}`

type RGBA = [number, number, number, number]

const COLOR_CACHE = new Map<string, RGBA | null>()

function parseColor(input: string | undefined): RGBA | null {
    if (typeof input !== "string") return null
    let hit = COLOR_CACHE.get(input)
    if (hit === undefined) {
        hit = parseColorRaw(input)
        COLOR_CACHE.set(input, hit)
    }
    return hit
}

function parseColorRaw(raw: string): RGBA | null {
    let s = raw.trim()
    const v = /^var\(\s*--[^,]+,\s*(.+)\)$/.exec(s)
    if (v) s = v[1].trim()
    if (s[0] === "#") {
        const h = s.slice(1)
        const x = (a: string) => parseInt(a, 16)
        let r: number
        let g: number
        let b: number
        let a = 255
        if (h.length === 3 || h.length === 4) {
            r = x(h[0] + h[0])
            g = x(h[1] + h[1])
            b = x(h[2] + h[2])
            if (h.length === 4) a = x(h[3] + h[3])
        } else if (h.length === 6 || h.length === 8) {
            r = x(h.slice(0, 2))
            g = x(h.slice(2, 4))
            b = x(h.slice(4, 6))
            if (h.length === 8) a = x(h.slice(6, 8))
        } else return null
        const out: RGBA = [r / 255, g / 255, b / 255, a / 255]
        return out.every(Number.isFinite) ? out : null
    }
    const m = /^(rgba?|hsla?)\(([^)]*)\)$/i.exec(s)
    if (!m) return null
    const parts = m[2].split(/[\s,/]+/).filter(Boolean)
    if (parts.length < 3) return null
    const num = (p: string, scale: number) =>
        p.endsWith("%") ? (parseFloat(p) / 100) * scale : parseFloat(p)
    const alpha = parts.length > 3 ? num(parts[3], 1) : 1
    let rgb: [number, number, number]
    if (m[1].toLowerCase().startsWith("rgb")) {
        rgb = [
            num(parts[0], 255) / 255,
            num(parts[1], 255) / 255,
            num(parts[2], 255) / 255,
        ]
    } else {
        const hh = (((parseFloat(parts[0]) % 360) + 360) % 360) / 360
        const ss = num(parts[1], 1)
        const ll = num(parts[2], 1)
        const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
        const p = 2 * ll - q
        const f = (t: number) => {
            t = (t + 1) % 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        rgb = [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)]
    }
    const out = [rgb[0], rgb[1], rgb[2], alpha]
    if (!out.every(Number.isFinite)) return null
    return out.map((c) => Math.min(1, Math.max(0, c))) as RGBA
}

function colorOr(input: string | undefined, fallback: string): RGBA {
    return parseColor(input) ?? parseColor(fallback) ?? [0, 0, 0, 1]
}

function clamp(v: unknown, lo: number, hi: number, d: number): number {
    const n = typeof v === "number" && Number.isFinite(v) ? v : d
    return Math.min(hi, Math.max(lo, n))
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("HarpCoil shader:", gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
    }
    return s
}

function buildProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = vs && fs ? gl.createProgram() : null
    if (prog && vs && fs) {
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
    }

    if (vs) gl.deleteShader(vs)
    if (fs) gl.deleteShader(fs)
    if (!prog) return null
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("HarpCoil link:", gl.getProgramInfoLog(prog))
        gl.deleteProgram(prog)
        return null
    }
    return prog
}

interface Live {
    background: string
    lineColor: string
    colorMode: HarpCoilColorMode
    color2: string
    color3: string
    lines: number
    lineWeight: number
    depth: number
    direction: HarpCoilDirection
    hover: number
    speed: number
    drift: number
    zoom: number
}

export default function HarpCoil({
    background = "#000000",
    lineColor = "#50DCF2",
    colorMode = "single",
    color2 = "#8A6CFF",
    color3 = "#FF5FC8",
    lines = 35,
    lineWeight = 10,
    depth = 6.3,
    direction = {"flow":"forward","sway":"reverse","mirror":"none","rotate":"auto"},
    hover = 10,
    speed = 10,
    drift = 5,
    zoom = 100,
    style,
}: HarpCoilProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    const [noGL, setNoGL] = useState(false)

    const live = useRef<Live>(null as unknown as Live)
    live.current = {
        background,
        lineColor,
        colorMode,
        color2,
        color3,
        lines,
        lineWeight,
        depth,
        direction: { ...DEFAULT_DIRECTION, ...direction },
        hover,
        speed,
        drift,
        zoom,
    }

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const canvas = document.createElement("canvas")
        Object.assign(canvas.style, {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            display: "block",
        })
        root.appendChild(canvas)
        const gl = canvas.getContext("webgl2", {
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
            depth: false,
        })
        const prog = gl ? buildProgram(gl) : null
        if (!gl || !prog) {
            canvas.remove()
            setNoGL(true)
            return
        }
        setNoGL(false)
        const reduced =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches

        gl.useProgram(prog)
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        )
        const loc = gl.getAttribLocation(prog, "aPos")
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

        const cache = new Map<string, WebGLUniformLocation | null>()
        const u = (name: string) => {
            if (!cache.has(name)) cache.set(name, gl.getUniformLocation(prog, name))
            return cache.get(name) ?? null
        }

        gl.uniform3f(u("uLens"), LOOK.hoverRadius, LOOK.hoverPush, LOOK.hoverGlow)
        gl.uniform1f(u("uTone"), LOOK.tone)

        let W = 0
        let H = 0
        const resize = () => {
            W = root.offsetWidth
            H = root.offsetHeight
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
            canvas.width = Math.max(1, Math.round(W * dpr))
            canvas.height = Math.max(1, Math.round(H * dpr))
        }
        const ro = new ResizeObserver(resize)
        ro.observe(root)
        resize()

        let mx = 0.5
        let my = 0.5
        let tx = 0.5
        let ty = 0.5
        let over = 0
        let hov = 0
        const onMove = (e: MouseEvent | PointerEvent) => {
            if (W <= 0 || H <= 0) return
            const rect = root.getBoundingClientRect()
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                tx = (e.clientX - rect.left) / Math.max(1, rect.width)
                ty = 1 - (e.clientY - rect.top) / Math.max(1, rect.height)
                over = 1
            } else {
                over = 0
            }
        }
        const onLeave = () => {
            over = 0
        }
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerleave", onLeave)

        const layout = createLayout()

        const wrap = LOOK.loopS * 300
        let clock = 0

        let flowPhase = 0
        const flowWrap = 2 * LOOK.flowWaves
        let raf = 0
        let last = -1
        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20)
            last = now
            const p = live.current
            const rate = clamp(p.speed, 0, 10, DEFAULT_SPEED) / 5
            const step = dt * rate * (reduced ? REDUCED_MOTION_RATE : 1)
            clock = (clock + step) % wrap
            const flow = p.direction.flow
            const flowOn = flow === "forward" || flow === "reverse"
            if (flowOn) {
                const dir = flow === "reverse" ? -1 : 1
                flowPhase = (flowPhase + dir * step * LOOK.flowRate + flowWrap) % flowWrap
            }
            const k = 1 - Math.exp(-dt * POINTER_EASE)
            mx += (tx - mx) * k
            my += (ty - my) * k
            hov += (over - hov) * k

            layoutBands(layout, {
                width: canvas.width,
                height: canvas.height,
                time: clock,
                lines: clamp(p.lines, 8, 48, DEFAULT_LINES),
                depth: clamp(p.depth, 0, 10, DEFAULT_DEPTH),
                drift: clamp(p.drift, 0, 10, DEFAULT_DRIFT),
                zoom: clamp(p.zoom, 50, 200, DEFAULT_ZOOM),
                direction: p.direction,
            })
            const bg = colorOr(p.background, DEFAULT_BACKGROUND)
            const line = colorOr(p.lineColor, DEFAULT_LINE_COLOR)
            const line2 = colorOr(p.color2, DEFAULT_COLOR_2)
            const line3 = colorOr(p.color3, DEFAULT_COLOR_3)

            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform2f(u("uRes"), canvas.width, canvas.height)
            gl.uniform2f(u("uMouse"), mx, my)
            gl.uniform1f(u("uHover"), hov * (clamp(p.hover, 0, 10, DEFAULT_HOVER) / 5))
            gl.uniform3f(u("uBg"), bg[0], bg[1], bg[2])
            gl.uniform1f(u("uBgAlpha"), bg[3])
            gl.uniform3f(u("uLine"), line[0], line[1], line[2])
            gl.uniform3f(u("uLine2"), line2[0], line2[1], line2[2])
            gl.uniform3f(u("uLine3"), line3[0], line3[1], line3[2])
            gl.uniform1f(u("uMulti"), p.colorMode === "gradient" ? 1 : 0)
            gl.uniform2f(u("uFlow"), flowOn ? 1 : 0, flowPhase)
            gl.uniform1f(
                u("uSigma"),
                LOOK.sigma * (clamp(p.lineWeight, 1, 10, DEFAULT_LINE_WEIGHT) / 5)
            )
            gl.uniform4fv(u("uCP"), layout.cp)
            gl.uniform4fv(u("uBox"), layout.box)
            gl.uniform4fv(u("uBand"), layout.band)
            gl.uniform4fv(u("uShape"), layout.shape)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerleave", onLeave)
            if (buf) gl.deleteBuffer(buf)
            gl.deleteProgram(prog)
            const lose = gl.getExtension("WEBGL_lose_context")
            if (lose) lose.loseContext()
            canvas.remove()
        }
    }, [])

    return (
        <div
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: noGL ? background : undefined,
                ...style,
            }}
        />
    )
}