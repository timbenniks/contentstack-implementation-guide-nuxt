// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiKey: process.env.NUXT_CONTENTSTACK_API_KEY,
      deliveryToken: process.env.NUXT_CONTENTSTACK_DELIVERY_TOKEN,
      previewToken: process.env.NUXT_CONTENTSTACK_PREVIEW_TOKEN,
      environment: process.env.NUXT_CONTENTSTACK_ENVIRONMENT,
      preview: process.env.NUXT_CONTENTSTACK_PREVIEW === "true",
      region: process.env.NUXT_CONTENTSTACK_REGION,
    },
  },
})