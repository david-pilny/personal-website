import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { contrastRatio, oklchToHex, toGamut, type Oklch } from '~/utils/oklch'

/*
 * The colour programme, importable. The exact same maths as the custom
 * properties in tokens.css: a polygon on the OKLCH hue wheel, one base
 * hue, equal chroma per slot. Slot 3 is the signal — same geometry,
 * chroma at the sRGB ceiling.
 */

export const HUE_BASE = 156.8 // MIDAFIT green
export const POLYGON = 5
export const L_ACCENT = 0.663 // chips, swatches on chalk
export const L_DEEP = 0.52 // surfaces carrying chalk text — ≥ 4.5:1 at every hue
export const C_ACCENT = 0.159
export const C_SIGNAL = 0.23
export const SIGNAL_SLOT = 3

export const CHALK: Oklch = { l: 0.955, c: 0.008, h: 91.5 }
export const INK: Oklch = { l: 0.195, c: 0.012, h: 99.5 }

export type SlotMeaning = 'product' | 'client' | 'play' | 'signal' | 'writing'

const MEANINGS: readonly SlotMeaning[] = ['product', 'client', 'play', 'signal', 'writing']

export interface PaletteSlot {
  index: number
  /** Semantic mapping — only defined for the pentagon's five slots. */
  meaning: SlotMeaning | undefined
  hue: number
  accent: Oklch
  deep: Oklch
  accentHex: string
  deepHex: string
  /** Measured WCAG ratio of chalk text on the deep variant. */
  chalkOnDeep: number
}

/** Pure form — the programme for any base hue and polygon count. */
export function buildPalette(baseHue: number, polygon: number = POLYGON): PaletteSlot[] {
  const step = 360 / polygon
  return Array.from({ length: polygon }, (_, index) => {
    const hue = (((baseHue + index * step) % 360) + 360) % 360
    const chroma = index === SIGNAL_SLOT ? C_SIGNAL : C_ACCENT
    const accent = toGamut({ l: L_ACCENT, c: chroma, h: hue })
    const deep = toGamut({ l: L_DEEP, c: chroma, h: hue })
    return {
      index,
      meaning: polygon === POLYGON ? MEANINGS[index] : undefined,
      hue,
      accent,
      deep,
      accentHex: oklchToHex(accent),
      deepHex: oklchToHex(deep),
      chalkOnDeep: contrastRatio(CHALK, deep),
    }
  })
}

/** Reactive form — recomputes as the base hue (or polygon) changes. */
export function usePalette(
  baseHue: MaybeRefOrGetter<number> = HUE_BASE,
  polygon: MaybeRefOrGetter<number> = POLYGON,
): ComputedRef<PaletteSlot[]> {
  return computed(() => buildPalette(toValue(baseHue), toValue(polygon)))
}
