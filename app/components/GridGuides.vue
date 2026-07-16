<script setup lang="ts">
// Permanent 12-column hairlines. Swiss designers hid the grid;
// showing it is the honest version for a developer's portfolio.
// `g` (wired in app.vue) raises the opacity and adds the baseline grid.
</script>

<template>
  <div class="grid-guides" aria-hidden="true">
    <div v-for="n in 12" :key="n" class="grid-guides__col" />
    <div class="grid-guides__baseline" />
  </div>
</template>

<style>
.grid-guides {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  max-width: var(--grid-max);
  margin-inline: auto;
  padding-inline: var(--grid-margin);
  pointer-events: none;
}

.grid-guides__col {
  border-inline: 1px solid var(--hairline);
}

.grid-guides__baseline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    oklch(from var(--ink) l c h / 0.12) 0 1px,
    transparent 1px var(--baseline)
  );
  opacity: 0;
}

.grid-debug .grid-guides__col {
  border-color: oklch(from var(--ink) l c h / 0.16);
}

.grid-debug .grid-guides__baseline {
  opacity: 1;
}
</style>
