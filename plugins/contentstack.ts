// Import the Contentstack delivery SDK and the Region type
import contentstack, { Region } from "@contentstack/delivery-sdk"

// Import the Contentstack Live Preview utility and the IStackSdk type
import ContentstackLivePreview, { type IStackSdk } from "@contentstack/live-preview-utils";

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

  // Initialize the Contentstack stack with the provided configuration values
  const stack = contentstack.stack({
    apiKey, // API key for Contentstack
    deliveryToken, // Delivery token for accessing published content
    environment, // Environment name (e.g., 'development', 'production')
    region: region === 'EU' ? Region.EU : Region.US, // Ternary operator to set the Contentstack API region to EU or US
    // Enable live preview if the preview mode is enabled
    live_preview: {
      enable: preview ? true : false,
      preview_token: previewToken,
      host: region === 'EU' ? "eu-rest-preview.contentstack.com" : "rest-preview.contentstack.com",
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
        host: region === "EU" ? "eu-app.contentstack.com" : "app.contentstack.com",
      },
      editButton: {
        enable: true, // Enable the edit button for live preview
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