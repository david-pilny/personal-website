<script setup lang="ts">
import {
  siClaude,
  siNestjs,
  siNuxt,
  siObsidian,
  siTailwindcss,
  siVercel,
  siVuedotjs,
} from 'simple-icons'

const { t } = useI18n()

/* Set in ink, not brand colour — colour never appears without meaning. */
const tools = [
  { name: 'Vue', icon: siVuedotjs },
  { name: 'Nuxt', icon: siNuxt },
  { name: 'Nest.js', icon: siNestjs },
  { name: 'Vercel', icon: siVercel },
  { name: 'Obsidian', icon: siObsidian },
  { name: 'Tailwind', icon: siTailwindcss },
  { name: 'Claude', icon: siClaude },
]
</script>

<template>
  <div class="tools">
    <p class="type-mono tools__head">{{ t('hero.toolsLabel') }}</p>
    <ul class="tools__grid">
      <li v-for="tool in tools" :key="tool.name" class="tools__cell">
        <svg class="tools__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="tool.icon.path" fill="currentColor" />
        </svg>
        <span class="type-mono tools__name">{{ tool.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tools__head {
  padding-bottom: var(--baseline);
}

.tools__grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

/* 3 baselines per cell: 24px icon + 24px label + 12px padding each side */
.tools__cell {
  padding: 12px 0;
}

.tools__cell:nth-child(n + 5) {
  border-top: 1px solid var(--hairline);
}

.tools__cell:not(:nth-child(4n + 1)) {
  border-left: 1px solid var(--hairline);
  padding-left: 12px;
}

.tools__icon {
  width: 24px;
  height: 24px;
}
</style>
