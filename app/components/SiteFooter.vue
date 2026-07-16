<script setup lang="ts">
const localePath = useLocalePath()

const EMAIL = 'pilny.david@proton.me'
const GITHUB = 'https://github.com/david-pilny'
const LINKEDIN = 'https://www.linkedin.com/in/david-piln%C3%BD-1237b9198'
</script>

<template>
  <footer class="footer">
    <div class="grid footer__inner type-mono">
      <a class="footer__item" :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
      <a class="footer__item" :href="GITHUB">{{ $t('footer.github') }}</a>
      <a class="footer__item" :href="LINKEDIN">{{ $t('footer.linkedin') }}</a>
      <NuxtLink class="footer__item" :to="localePath('/cv')">{{ $t('footer.cv') }}</NuxtLink>
      <NuxtLink class="footer__item" :to="localePath('/colophon')">{{ $t('footer.colophon') }}</NuxtLink>
      <span class="footer__place">Praha · 50.08N 14.44E</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--rule);
}

.footer__inner {
  padding-top: 12px;
  padding-bottom: 36px;
}

.footer__item {
  grid-column: span 2;
  text-decoration: none;
}

.footer__place {
  grid-column: 11 / -1;
  justify-self: end;
  opacity: var(--dim);
}

@media (max-width: 720px) {
  .footer__item {
    grid-column: 1 / -1;
  }

  .footer__place {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>
