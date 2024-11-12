import contentstack, { Region } from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { type IStackSdk } from "@contentstack/live-preview-utils";

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

  if (preview && import.meta.client) {
    ContentstackLivePreview.init({
      ssr: false,
      mode: "builder",
      enable: preview ? true : false,
      stackSdk: stack.config as IStackSdk,
      stackDetails: {
        apiKey: apiKey,
        environment: environment,
      },
      clientUrlParams: {
        host: region === "EU" ? "eu-app.contentstack.com" : "app.contentstack.com",
      },
      editButton: {
        enable: true,
      }
    });
  }

  return {
    provide: {
      stack,
      preview,
      ContentstackLivePreview
    },
  };
});