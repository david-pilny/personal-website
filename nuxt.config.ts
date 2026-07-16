// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxtjs/i18n'],

  content: {
    // Node ≥ 22.5 ships node:sqlite — no native better-sqlite3 build needed.
    experimental: { nativeSqlite: true },
  },

  typescript: {
    strict: true,
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // No detection redirect: it needs a cookie, and this site sets none.
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'cs', language: 'cs', name: 'Čeština', file: 'cs.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
    ],
  },

  css: [
    // One Archivo file carries both axes (wght + wdth): body at 100%,
    // display at font-stretch 125% (“Archivo Expanded”). No italics shipped.
    '@fontsource-variable/archivo/wdth.css',
    '@fontsource-variable/jetbrains-mono/index.css',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
  ],

  app: {
    head: {
      // Restore the visitor's hue preference before first paint —
      // the one permitted use of localStorage (§7).
      script: [
        {
          innerHTML:
            "try{var h=localStorage.getItem('hue-base');if(h)document.documentElement.style.setProperty('--hue-base',h)}catch(e){}",
        },
      ],
      title: 'David Pilný — Frontend Engineer',
      meta: [
        {
          name: 'description',
          content:
            'David Pilný. Builds interfaces in Vue and TypeScript. Prague.',
        },
      ],
    },
  },
})
