/*
 * OKLCH → sRGB conversion and WCAG contrast, hand-rolled.
 * Mirrors what the browser does with the CSS custom properties in
 * tokens.css, so the colophon can print true coordinates, hexes and
 * measured contrast ratios for any --hue-base.
 */

export interface Oklch {
  l: number
  c: number
  h: number
}

/** Gamma-encoded sRGB channels, 0–1, not yet gamut-clamped. */
type Rgb = [number, number, number]

function oklchToLinearSrgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3
  return [
    +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ]
}

const isInGamut = (rgb: Rgb): boolean => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4)

/**
 * Approximate CSS gamut mapping: hold lightness and hue, reduce chroma
 * until the colour fits in sRGB.
 */
export function toGamut(color: Oklch): Oklch {
  if (isInGamut(oklchToLinearSrgb(color.l, color.c, color.h))) return color
  let lo = 0
  let hi = color.c
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (isInGamut(oklchToLinearSrgb(color.l, mid, color.h))) lo = mid
    else hi = mid
  }
  return { ...color, c: lo }
}

function linearToRgb(color: Oklch): Rgb {
  const mapped = toGamut(color)
  return oklchToLinearSrgb(mapped.l, mapped.c, mapped.h).map((v) => {
    const cl = Math.min(1, Math.max(0, v))
    return cl <= 0.0031308 ? 12.92 * cl : 1.055 * cl ** (1 / 2.4) - 0.055
  }) as Rgb
}

export function oklchToHex(color: Oklch): string {
  return (
    '#' +
    linearToRgb(color)
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

export function relativeLuminance(color: Oklch): number {
  const [r, g, b] = linearToRgb(color).map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

export function contrastRatio(a: Oklch, b: Oklch): number {
  const ya = relativeLuminance(a)
  const yb = relativeLuminance(b)
  const [hi, lo] = ya > yb ? [ya, yb] : [yb, ya]
  return (hi + 0.05) / (lo + 0.05)
}
