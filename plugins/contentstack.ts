import contentstack, { Region } from "@contentstack/delivery-sdk"

export default defineNuxtPlugin((nuxtApp) => {
  const {
    apiKey,
    deliveryToken,
    previewToken,
    region,
    environment,
    preview
  } = nuxtApp.$config.public;

  const stack = contentstack.stack({
    apiKey,
    deliveryToken,
    environment,
    region: region === 'EU' ? Region.EU : Region.US,
    live_preview: {
      enable: preview ? true : false,
      preview_token: previewToken,
      host: region === 'EU' ? "eu-rest-preview.contentstack.com" : "rest-preview.contentstack.com",
    }
  });

  return {
    provide: {
      stack,
      apiKey,
      preview,
      region,
      environment
    },
  };
});