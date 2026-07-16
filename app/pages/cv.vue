<script setup lang="ts">
const { t, locale } = useI18n()

const collection = computed(() => (locale.value === 'cs' ? 'cv_cs' : 'cv_en') as 'cv_cs' | 'cv_en')

const { data: cv } = await useAsyncData(
  () => `cv-${collection.value}`,
  () => queryCollection(collection.value).first(),
  { watch: [collection] },
)

if (!cv.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}

useHead(() => ({ title: `${t('cv.title')} — David Pilný` }))
</script>

<template>
  <div v-if="cv" class="cv-page">
    <SiteHeader />

    <main class="grid cv">
      <!-- head: name + contact, one Swiss row -->
      <header class="cv__head">
        <div>
          <h1 class="type-display-l">{{ cv.name }}</h1>
          <p class="type-body-s cv__role">{{ cv.role }}</p>
        </div>
        <address class="type-mono cv__contact">
          <a :href="`mailto:${cv.email}`">{{ cv.email }}</a>
          <span>{{ cv.phone }}</span>
          <a :href="cv.github">github/david-pilny</a>
          <a :href="cv.linkedin">linkedin/david-pilný</a>
          <span>{{ cv.location }} · {{ cv.remote }}</span>
        </address>
      </header>

      <!-- experience -->
      <section class="cv__section">
        <h2 class="type-mono cv__label">{{ t('cv.experience') }}</h2>
        <div class="cv__entries">
          <article v-for="entry in cv.experience" :key="entry.company" class="cv__entry">
            <div class="type-mono cv__period">
              <span
                class="cv__chip"
                :style="{ background: `var(--c-${CATEGORY_SLOT[entry.category]})` }"
                aria-hidden="true"
              />
              {{ entry.period }}
            </div>
            <div class="cv__body">
              <h3 class="type-body cv__company">
                {{ entry.company }} — {{ entry.role }}
              </h3>
              <p v-if="entry.note" class="type-mono cv__note">{{ entry.note }}</p>
              <div v-for="(proj, i) in entry.projects" :key="i" class="cv__project">
                <h4 v-if="proj.name" class="type-mono cv__project-name">{{ proj.name }}</h4>
                <ul class="type-body-s cv__bullets">
                  <li v-for="bullet in proj.bullets" :key="bullet">{{ bullet }}</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- education -->
      <section class="cv__section">
        <h2 class="type-mono cv__label">{{ t('cv.education') }}</h2>
        <div class="cv__entries">
          <article class="cv__entry">
            <div class="type-mono cv__period">{{ cv.education.period }}</div>
            <div class="cv__body">
              <h3 class="type-body cv__company">
                {{ cv.education.school }} — {{ cv.education.degree }}
              </h3>
              <p class="type-mono cv__note">{{ cv.education.faculty }}</p>
              <ul class="type-body-s cv__bullets">
                <li>{{ t('cv.thesis') }}: {{ cv.education.thesis }} ({{ cv.education.thesisTech }})</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <!-- languages -->
      <section class="cv__section">
        <h2 class="type-mono cv__label">{{ t('cv.languages') }}</h2>
        <div class="cv__entries">
          <div v-for="lang in cv.languages" :key="lang.name" class="cv__entry cv__lang">
            <div class="type-mono cv__period">{{ lang.level }}</div>
            <div class="cv__body cv__lang-body">
              <span class="type-body-s">{{ lang.name }}</span>
              <span v-if="lang.cert" class="type-mono cv__note">{{ lang.cert }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- skills -->
      <section class="cv__section">
        <h2 class="type-mono cv__label">{{ t('cv.skills') }}</h2>
        <div class="cv__entries">
          <div v-for="group in cv.skills" :key="group.group" class="cv__entry cv__lang">
            <div class="type-mono cv__period">{{ group.group }}</div>
            <div class="cv__body">
              <span class="type-body-s">{{ group.items.join(' · ') }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.cv {
  padding-top: calc(var(--baseline) * 2);
  padding-bottom: calc(var(--baseline) * 4);
  row-gap: calc(var(--baseline) * 2);
}

/* ── head ─────────────────────────────────────────────────── */

.cv__head {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  border-bottom: 1px solid var(--rule);
  padding-bottom: calc(var(--baseline) * 2 - 1px);
}

.cv__head > div {
  grid-column: 1 / span 7;
}

.cv__role {
  padding-top: var(--baseline);
}

.cv__contact {
  grid-column: 8 / -1;
  display: flex;
  flex-direction: column;
  font-style: normal;
}

.cv__contact a {
  text-decoration: none;
}

/* ── sections ─────────────────────────────────────────────── */

.cv__section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  border-bottom: 1px solid var(--hairline);
  padding-bottom: calc(var(--baseline) * 2 - 1px);
}

.cv__label {
  grid-column: 1 / span 2;
}

.cv__entries {
  grid-column: 3 / -1;
  display: grid;
  grid-template-columns: subgrid;
  row-gap: var(--baseline);
}

.cv__entry {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

/* subgrid inside .cv__entries: its col 1 = page col 3 */
.cv__period {
  grid-column: 1 / span 2;
  align-self: start;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  line-height: var(--baseline);
}

.cv__chip {
  width: 10px;
  height: 10px;
  flex: none;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.cv__body {
  grid-column: 3 / -1;
}

.cv__company {
  font-weight: 500;
}

.cv__note {
  opacity: var(--dim);
}

.cv__project {
  padding-top: var(--baseline);
}

.cv__project-name {
  opacity: var(--dim);
}

.cv__bullets {
  list-style: none;
  max-width: 72ch;
}

.cv__bullets li {
  padding-left: 20px;
  position: relative;
}

.cv__bullets li::before {
  content: '—';
  position: absolute;
  left: 0;
}

.cv__lang-body {
  display: flex;
  gap: var(--gutter);
  align-items: baseline;
}

/* ── responsive ───────────────────────────────────────────── */

@media screen and (max-width: 840px) {
  .cv__head > div,
  .cv__contact {
    grid-column: 1 / -1;
  }

  .cv__contact {
    padding-top: var(--baseline);
  }

  .cv__label {
    grid-column: 1 / -1;
    padding-bottom: var(--baseline);
  }

  .cv__entries {
    grid-column: 1 / -1;
  }

  .cv__period {
    grid-column: 1 / -1;
  }

  .cv__body {
    grid-column: 1 / -1;
  }
}

/* ── print: the same document on A4 ────────────────────────────
   Same geometry (side label · period column · body), but built on
   CSS tables: Chromium fragments grid/subgrid across page breaks
   unreliably, while table pagination is battle-tested. */

@media print {
  .cv {
    display: block;
    padding-top: 0;
    padding-bottom: 0;
  }

  .cv__head {
    display: table;
    width: 100%;
    table-layout: fixed;
    padding-bottom: 23px;
  }

  .cv__head > div {
    display: table-cell;
    vertical-align: top;
  }

  .cv__contact {
    display: table-cell;
    width: 38%;
    vertical-align: top;
  }

  .cv__contact > * {
    display: block;
  }

  .cv__section {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-bottom: none;
    padding-top: var(--baseline);
    padding-bottom: var(--baseline);
  }

  .cv__label {
    display: table-cell;
    width: 16%;
    vertical-align: top;
  }

  .cv__entries {
    display: table-cell;
    vertical-align: top;
  }

  .cv__entry {
    display: table;
    width: 100%;
    table-layout: fixed;
    padding-bottom: var(--baseline);
  }

  .cv__period {
    display: table-cell;
    width: 30%;
    vertical-align: top;
  }

  .cv__chip {
    display: inline-block;
    margin-right: 8px;
    vertical-align: baseline;
  }

  .cv__body {
    display: table-cell;
    vertical-align: top;
  }

  .cv__company {
    break-after: avoid;
  }

  .cv__project {
    break-inside: avoid;
  }

  /* flex gaps die inside table cells — restore the spacing */
  .cv__lang-body > * {
    margin-right: var(--gutter);
  }

  /* compact rows for languages/skills so the document holds two pages */
  .cv__lang {
    padding-bottom: 8px;
  }

  .cv__section {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
</style>
