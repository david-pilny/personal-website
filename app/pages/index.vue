<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const collection = useWorkCollection()

const { data: projects } = await useAsyncData(
  () => `work-index-${collection.value}`,
  () => queryCollection(collection.value).order('order', 'ASC').all(),
  { watch: [collection] },
)

useHead(() => ({
  title:
    locale.value === 'cs'
      ? 'David Pilný — Frontend inženýr'
      : 'David Pilný — Frontend Engineer',
}))
</script>

<template>
  <div>
    <SiteHeader />

    <main>
      <!-- Zone one: loud. The only thing on the page allowed to shout. -->
      <section class="grid hero">
        <div class="hero__intro">
          <h1 class="type-display-xl hero__name">David<br />Pilný</h1>
          <div class="hero__rule" aria-hidden="true" />
          <p class="type-body-s hero__bio">{{ t('hero.bio') }}</p>
        </div>

        <div class="hero__status">
          <p class="type-mono">{{ t('hero.statusLabel') }}</p>
          <p class="type-display-l">{{ t('hero.status') }}</p>
          <p class="type-mono">{{ t('hero.place') }}</p>
        </div>
      </section>

      <!-- Zone two: restraint. Colour only as meaning. -->
      <section class="grid work">
        <h2 class="type-mono work__head">{{ t('work.head') }}</h2>
        <table class="work__table">
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.slug"
              class="work__row"
              :style="{ '--row-flood': `var(--c-${CATEGORY_SLOT[project.category]}-deep)` }"
            >
              <td class="work__chip-cell">
                <span
                  class="work__chip"
                  :style="{ background: `var(--c-${CATEGORY_SLOT[project.category]})` }"
                />
              </td>
              <th scope="row" class="work__name">
                <NuxtLink :to="localePath(`/work/${project.slug}`)" class="work__link">
                  {{ project.title }}
                </NuxtLink>
              </th>
              <td class="type-mono work__stack">{{ project.stack.join(' · ') }}</td>
              <td class="type-mono work__category">{{ t(`category.${project.category}`) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ── hero ─────────────────────────────────────────────────── */

.hero {
  min-height: calc(100dvh - 48px);
  padding-top: calc(var(--baseline) * 3);
  padding-bottom: calc(var(--baseline) * 3);
}

/* Stretches with the row, so its right border is the hero's dividing rule. */
.hero__intro {
  grid-column: 1 / span 8;
  border-right: 1px solid var(--rule);
}

.hero__name {
  overflow-wrap: normal;
}

.hero__rule {
  height: 1px;
  background: var(--rule);
  margin-top: calc(var(--baseline) * 2);
  margin-bottom: calc(var(--baseline) - 1px);
}

.hero__bio {
  max-width: 34ch;
}

/* Full-bleed to the right viewport edge; the loud zone.
   Compact — a signal tile, not a poster. */
.hero__status {
  grid-column: 9 / -1;
  align-self: start;
  margin-right: calc(-1 * (var(--grid-margin) + max(0px, (100vw - var(--grid-max)) / 2)));
  min-height: 168px;
  background: var(--color-signal-deep);
  color: var(--chalk);
  padding: var(--baseline);
  display: flex;
  flex-direction: column;
}

.hero__status .type-display-l {
  flex: 1;
  padding-block: var(--baseline);
}

/* ── project index ────────────────────────────────────────── */

.work {
  padding-bottom: calc(var(--baseline) * 4);
}

.work__head {
  grid-column: 1 / -1;
  padding-bottom: var(--baseline);
}

.work__table {
  grid-column: 1 / -1;
  border-collapse: collapse;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

/* The hue flood: saturation as a reward for engagement (§5.3).
   reduced-motion gets the flood instantly (base.css zeroes durations). */
.work__row {
  border-top: 1px solid var(--hairline);
  position: relative;
  transition: background-color 120ms ease-out;
}

.work__row:first-child {
  border-top: none;
}

.work__row:hover,
.work__row:focus-within {
  background-color: var(--row-flood);
  color: var(--chalk);
}

.work__row:focus-within .work__link:focus-visible {
  background: none;
  color: inherit;
}

.work__row > * {
  padding: 12px 0;
  text-align: left;
  vertical-align: middle;
  transition: color 120ms ease-out;
}

.work__chip-cell {
  width: 10px;
  padding-right: var(--gutter);
}

.work__chip {
  display: block;
  width: 10px;
  height: 10px;
}

.work__name {
  font-size: var(--size-body);
  font-weight: 500;
  padding-right: var(--gutter);
}

.work__link {
  text-decoration: none;
}

/* the whole row is the target */
.work__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.work__stack {
  white-space: nowrap;
  padding-right: var(--gutter);
}

.work__category {
  text-align: right;
  white-space: nowrap;
}

/* ── responsive ───────────────────────────────────────────── */

@media (max-width: 840px) {
  .hero {
    row-gap: calc(var(--baseline) * 2);
  }

  .hero__intro {
    grid-column: 1 / -1;
    border-right: none;
    border-bottom: 1px solid var(--rule);
    padding-bottom: calc(var(--baseline) * 2 - 1px);
  }

  .hero__status {
    grid-column: 1 / -1;
    margin-left: calc(-1 * (var(--grid-margin) + max(0px, (100vw - var(--grid-max)) / 2)));
  }
}

@media (max-width: 480px) {
  .work__stack {
    display: none;
  }
}
</style>
