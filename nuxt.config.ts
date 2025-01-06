// Import the defineNuxtConfig function to define the Nuxt configuration
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Set the compatibility date for future Nuxt versions
  compatibilityDate: '2024-04-03',

  // Enable development tools
  devtools: { enabled: true },

  // Configure future compatibility settings
  future: {
    compatibilityVersion: 4, // Set the compatibility version to 4
  },

  // Include Nuxt modules
  modules: ['@nuxtjs/tailwindcss'], // Add Tailwind CSS module for styling

  // Define runtime configuration
  runtimeConfig: {
    public: {
      // Public configuration values, accessible in the client-side code
      apiKey: process.env.NUXT_CONTENTSTACK_API_KEY, // Contentstack API key
      deliveryToken: process.env.NUXT_CONTENTSTACK_DELIVERY_TOKEN, // Contentstack delivery token
      previewToken: process.env.NUXT_CONTENTSTACK_PREVIEW_TOKEN, // Contentstack preview token
      environment: process.env.NUXT_CONTENTSTACK_ENVIRONMENT, // Contentstack environment
      preview: process.env.NUXT_CONTENTSTACK_PREVIEW === "true", // Boolean indicating if preview mode is enabled
      region: process.env.NUXT_CONTENTSTACK_REGION, // Contentstack region
    },
  },
});