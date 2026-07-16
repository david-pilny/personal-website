<script setup lang="ts">
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <header class="header">
    <div class="grid header__inner">
      <NuxtLink :to="localePath('index')" class="type-mono header__id">
        {{ $t('header.id') }}
      </NuxtLink>
      <nav class="type-mono header__lang" aria-label="Language">
        <template v-for="(l, i) in locales" :key="l.code">
          <span v-if="i > 0" class="header__dot" aria-hidden="true">·</span>
          <NuxtLink
            :to="switchLocalePath(l.code)"
            class="header__locale"
            :class="{ 'header__locale--active': l.code === locale }"
            :aria-current="l.code === locale ? 'true' : undefined"
            :lang="l.code"
            >{{ l.code }}</NuxtLink
          >
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--rule);
}

.header__inner {
  align-items: baseline;
  padding-top: 11px;
  padding-bottom: 12px;
}

.header__id {
  grid-column: 1 / span 6;
  text-decoration: none;
}

.header__lang {
  grid-column: 7 / -1;
  justify-self: end;
  display: flex;
  gap: 8px;
}

/* Spec said 40%, but 11px text below --dim fails the 4.5:1 floor (§7 wins). */
.header__locale {
  opacity: var(--dim);
  text-decoration: none;
}

.header__locale--active {
  opacity: 1;
}
</style>
