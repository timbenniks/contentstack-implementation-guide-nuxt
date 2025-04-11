// Import the Contentstack delivery SDK and the Region type
import contentstack, { Region } from "@contentstack/delivery-sdk"

// Import the Contentstack Live Preview utility and the IStackSdk type
import ContentstackLivePreview, { type IStackSdk } from "@contentstack/live-preview-utils";
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Destructure the necessary configuration values from the Nuxt app's public configuration
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
  // Check if preview mode is enabled and if the code is running on the client-side
  if (preview && import.meta.client) {
    // Initialize the Contentstack Live Preview SDK with the provided configuration values
    ContentstackLivePreview.init({
      ssr: false, // Disable server-side rendering for live preview
      mode: "builder", // Set the mode to 'builder' for live preview
      enable: preview ? true : false, // Ternary operator to enable live preview if preview mode is enabled/true
      stackSdk: stack.config as IStackSdk, // Pass the stack configuration
      stackDetails: {
        apiKey: apiKey, // API key for Contentstack
        environment: environment, // Environment name (e.g., 'development', 'production')
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
  // Return the stack, preview mode, and Contentstack Live Preview instance
  return {
    provide: {
      stack, // Provide the Contentstack stack instance
      preview, // Provide the preview mode status
      ContentstackLivePreview // Provide the Contentstack Live Preview instance
    },
  };
});