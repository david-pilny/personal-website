<script setup lang="ts">
const i18nHead = useLocaleHead()
useHead(() => ({ htmlAttrs: i18nHead.value.htmlAttrs }))

// `g` toggles the full grid + baseline overlay (§6).
// Not advertised beyond one mono line in the colophon.
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return
  const t = e.target as HTMLElement | null
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  document.documentElement.classList.toggle('grid-debug')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <GridGuides />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
