<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const collection = useWorkCollection()

const slug = computed(() => String(route.params.slug))

const { data: project } = await useAsyncData(
  () => `work-${collection.value}-${slug.value}`,
  () => queryCollection(collection.value).where('slug', '=', slug.value).first(),
  { watch: [collection, slug] },
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}

/* One hue per page — the category's slot is the only accent, no exceptions. */
const slot = computed(() => CATEGORY_SLOT[project.value!.category])

useHead(() => ({ title: `${project.value?.title} — David Pilný` }))
</script>

<template>
  <div v-if="project" class="detail" :style="{
    '--page-hue': `var(--c-${slot})`,
    '--page-hue-deep': `var(--c-${slot}-deep)`,
  }">
    <SiteHeader />

    <main class="grid detail__main">
      <p class="type-mono detail__back">
        <NuxtLink :to="localePath('index')">← {{ t('detail.back') }}</NuxtLink>
      </p>

      <header class="detail__header">
        <h1 class="type-display-l detail__title">
          <span class="detail__chip" aria-hidden="true" />{{ project.title }}
        </h1>
      </header>

      <dl class="type-mono detail__meta">
        <div>
          <dt>{{ t('detail.role') }}</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div>
          <dt>{{ t('detail.period') }}</dt>
          <dd>{{ project.period }}</dd>
        </div>
        <div>
          <dt>{{ t('detail.stack') }}</dt>
          <dd>{{ project.stack.join(' · ') }}</dd>
        </div>
        <div v-if="project.url">
          <dt>{{ t('detail.url') }}</dt>
          <dd><a :href="project.url">{{ project.url }}</a></dd>
        </div>
        <div>
          <dt>{{ t(`category.${project.category}`) }}</dt>
          <dd><span class="detail__chip detail__chip--meta" aria-hidden="true" /></dd>
        </div>
      </dl>

      <div class="detail__content">
        <p class="type-body detail__summary">{{ project.summary }}</p>
        <ContentRenderer :value="project" class="detail__prose" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.detail__main {
  padding-top: calc(var(--baseline) * 2);
  padding-bottom: calc(var(--baseline) * 4);
}

.detail__back {
  grid-column: 1 / -1;
  padding-bottom: calc(var(--baseline) * 2);
}

.detail__back a {
  text-decoration: none;
}

.detail__header {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--rule);
  padding-bottom: calc(var(--baseline) * 2 - 1px);
}

.detail__chip {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: var(--page-hue);
  margin-right: var(--gutter);
  vertical-align: middle;
}

.detail__chip--meta {
  margin-right: 0;
}

.detail__meta {
  grid-column: 1 / span 3;
  padding-top: var(--baseline);
}

.detail__meta dt {
  opacity: var(--dim);
}

.detail__meta > div {
  padding-bottom: var(--baseline);
}

.detail__content {
  grid-column: 4 / span 5;
  padding-top: var(--baseline);
}

.detail__summary {
  max-width: 44ch;
  font-weight: 500;
  margin-bottom: calc(var(--baseline) * 2);
}

.detail__prose :deep(p) {
  max-width: 60ch;
  margin-bottom: var(--baseline);
}

.detail__prose :deep(a),
.detail__meta a {
  color: var(--page-hue-deep);
  text-decoration-color: var(--page-hue);
}

@media (max-width: 840px) {
  .detail__meta,
  .detail__content {
    grid-column: 1 / -1;
  }
}
</style>
