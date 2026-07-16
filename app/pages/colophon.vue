<script setup lang="ts">
import { HUE_BASE, POLYGON, C_ACCENT, C_SIGNAL, L_ACCENT, L_DEEP, usePalette } from '~/composables/usePalette'

const { t } = useI18n()

const hue = ref(HUE_BASE)
const polygon = ref(POLYGON)
const palette = usePalette(hue, polygon)

onMounted(() => {
  try {
    const stored = localStorage.getItem('hue-base')
    if (stored !== null) hue.value = Number(stored)
  } catch {
    /* private mode — the slider still works, it just won't persist */
  }

  watch(hue, (value) => {
    document.documentElement.style.setProperty('--hue-base', String(value))
    try {
      localStorage.setItem('hue-base', String(value))
    } catch {
      /* ignore */
    }
  })

  // The polygon is a demonstration, not a preference: not persisted (§7),
  // and restored to the pentagon when you leave.
  watch(polygon, (value) => {
    document.documentElement.style.setProperty('--polygon', String(value))
  })
})

onBeforeUnmount(() => {
  document.documentElement.style.setProperty('--polygon', String(POLYGON))
})

const fmt = (n: number, d = 1) => n.toFixed(d)

useHead(() => ({ title: `${t('colophon.title')} — David Pilný` }))
</script>

<template>
  <div>
    <SiteHeader />

    <main class="grid colophon">
      <h1 class="type-display-l colophon__title">{{ t('colophon.title') }}</h1>

      <!-- programme -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.programmeHead') }}</h2>
        <div class="colophon__body">
          <p class="type-body-s colophon__prose">{{ t('colophon.programmeIntro') }}</p>

          <pre class="type-mono colophon__math">
hue(i) = {{ fmt(hue) }} + i × (360 / {{ polygon }})   i = 0…{{ polygon - 1 }}
accent = oklch({{ fmt(L_ACCENT, 3) }} {{ fmt(C_ACCENT, 3) }} hue(i))
deep   = oklch({{ fmt(L_DEEP, 3) }} {{ fmt(C_ACCENT, 3) }} hue(i))
signal = chroma {{ fmt(C_SIGNAL, 2) }} — the sRGB ceiling, slot 3 only</pre>

          <p class="type-body-s colophon__prose">{{ t('colophon.lightness') }}</p>

          <div class="colophon__controls type-mono">
            <label>
              {{ t('colophon.hue') }}
              <input v-model.number="hue" type="range" min="0" max="360" step="1" />
              <span class="colophon__value">{{ fmt(hue) }}</span>
            </label>
            <label>
              {{ t('colophon.polygon') }}
              <input v-model.number="polygon" type="range" min="3" max="8" step="1" />
              <span class="colophon__value">{{ polygon }}</span>
            </label>
          </div>
          <p class="type-mono colophon__demo-note">{{ t('colophon.demo') }}</p>

          <div class="colophon__swatches">
            <div v-for="slot in palette" :key="slot.index" class="colophon__swatch">
              <div class="colophon__swatch-chip" :style="{ background: slot.accentHex }" />
              <div class="colophon__swatch-deep" :style="{ background: slot.deepHex }">
                <span class="type-mono">{{ fmt(slot.chalkOnDeep, 2) }}:1</span>
              </div>
              <p class="type-mono colophon__swatch-data">
                c-{{ slot.index }}<template v-if="slot.meaning"> — {{ t(`category.${slot.meaning}`) }}</template>
                <br />oklch({{ fmt(slot.accent.l, 3) }} {{ fmt(slot.accent.c, 3) }} {{ fmt(slot.hue) }})
                <br />{{ slot.accentHex }} / {{ slot.deepHex }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- legend -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.legendHead') }}</h2>
        <div class="colophon__body">
          <ul class="colophon__legend type-mono">
            <li v-for="(meaning, i) in (['product', 'client', 'play', 'signal', 'writing'] as const)" :key="meaning">
              <span
                class="colophon__legend-chip"
                :style="{ background: `var(--c-${i})` }"
                aria-hidden="true"
              />
              c-{{ i }} · {{ t(`category.${meaning}`) }}
            </li>
          </ul>
          <p class="type-body-s colophon__prose">{{ t('colophon.legendNote') }}</p>
        </div>
      </section>

      <!-- type -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.typeHead') }}</h2>
        <div class="colophon__body">
          <p class="type-body-s colophon__prose">{{ t('colophon.typeBody') }}</p>
          <div class="colophon__scale">
            <p class="type-display-xl">Aa</p>
            <p class="type-mono">display-xl · clamp(64–148px) / 0.86 · 600 · −0.035em</p>
            <p class="type-display-l">Aa řůž</p>
            <p class="type-mono">display-l · clamp(32–56px) / 0.95</p>
            <p class="type-body">Aa — 16px / 24px</p>
            <p class="type-body-s">Aa — 13px / 24px</p>
            <p class="type-mono">aa — 11px / 24px · +0.08em · uppercase</p>
          </div>
        </div>
      </section>

      <!-- grid -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.gridHead') }}</h2>
        <div class="colophon__body">
          <p class="type-body-s colophon__prose">{{ t('colophon.gridBody') }}</p>
          <p class="type-mono">{{ t('colophon.gridHint') }}</p>
        </div>
      </section>

      <!-- sources -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.sourcesHead') }}</h2>
        <div class="colophon__body">
          <p class="type-body-s colophon__prose">{{ t('colophon.sourcesQuote') }}</p>
          <p class="type-mono">Karl Gerstner — Designing Programmes, Arthur Niggli, 1964</p>
          <p class="type-mono">Karl Gerstner — The Forms of Color, MIT Press, 1986</p>
        </div>
      </section>

      <!-- stack -->
      <section class="colophon__section">
        <h2 class="type-mono colophon__label">{{ t('colophon.stackHead') }}</h2>
        <div class="colophon__body">
          <p class="type-body-s colophon__prose">{{ t('colophon.stackBody') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.colophon {
  padding-top: calc(var(--baseline) * 2);
  padding-bottom: calc(var(--baseline) * 4);
  row-gap: calc(var(--baseline) * 2);
}

.colophon__title {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--rule);
  padding-bottom: calc(var(--baseline) * 2 - 1px);
}

.colophon__section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  border-bottom: 1px solid var(--hairline);
  padding-bottom: calc(var(--baseline) * 2 - 1px);
}

.colophon__label {
  grid-column: 1 / span 2;
}

.colophon__body {
  grid-column: 3 / span 8;
}

.colophon__prose {
  max-width: 60ch;
  margin-bottom: var(--baseline);
}

.colophon__math {
  font-size: var(--size-mono);
  line-height: var(--baseline);
  letter-spacing: var(--tracking-mono);
  margin-bottom: var(--baseline);
  overflow-x: auto;
}

.colophon__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gutter);
  margin-bottom: var(--baseline);
}

.colophon__controls label {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  flex: 1;
}

.colophon__controls input {
  flex: 1;
  accent-color: var(--ink);
}

.colophon__value {
  min-width: 48px;
  text-align: right;
}

.colophon__demo-note {
  opacity: var(--dim);
  margin-bottom: var(--baseline);
}

.colophon__swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
  gap: var(--gutter);
}

.colophon__swatch-chip {
  height: var(--baseline);
}

.colophon__swatch-deep {
  height: calc(var(--baseline) * 2);
  color: var(--chalk);
  display: flex;
  align-items: center;
  padding-inline: 8px;
}

.colophon__swatch-data {
  padding-top: 8px;
  overflow-wrap: anywhere;
}

.colophon__legend {
  list-style: none;
  margin-bottom: var(--baseline);
}

.colophon__legend-chip {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 12px;
}

.colophon__scale > * {
  margin-bottom: var(--baseline);
}

@media (max-width: 840px) {
  .colophon__label {
    grid-column: 1 / -1;
    padding-bottom: var(--baseline);
  }

  .colophon__body {
    grid-column: 1 / -1;
  }
}
</style>
