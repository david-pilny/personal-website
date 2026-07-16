export default defineI18nConfig(() => ({
  legacy: false,
  // ru and de are scaffolded: anything they don't translate falls back to en.
  fallbackLocale: 'en',
}))
