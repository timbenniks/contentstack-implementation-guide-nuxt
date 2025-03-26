import contentstack, { Region } from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { type IStackSdk } from "@contentstack/live-preview-utils";
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

export default defineNuxtPlugin((nuxtApp) => {
  const {
    apiKey,
    deliveryToken,
    previewToken,
    region,
    environment,
    preview
  } = nuxtApp.$config.public;

  const regionEnum: Region = getRegionForString(region)
  const endpoints = getContentstackEndpoints(regionEnum, true)

  const stack = contentstack.stack({
    apiKey,
    deliveryToken,
    environment,
    region: regionEnum,
    live_preview: {
      enable: preview ? true : false,
      preview_token: previewToken,
      host: endpoints.preview
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
        host: endpoints.application
      },
      editButton: {
        enable: true,
        exclude: ["outsideLivePreviewPortal"]
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