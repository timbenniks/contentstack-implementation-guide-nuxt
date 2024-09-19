import type { Stack } from "@contentstack/delivery-sdk/dist/types/src/lib/stack";
import ContentstackLivePreview, { type IStackSdk } from "@contentstack/live-preview-utils";

export default defineNuxtPlugin((nuxtApp) => {
  const { $stack, $apiKey, $region, $environment, $preview } = nuxtApp

  if ($preview) {
    ContentstackLivePreview.init({
      ssr: false,
      enable: !!$preview,
      stackSdk: ($stack as Stack).config as IStackSdk,
      stackDetails: {
        apiKey: $apiKey as string,
        environment: $environment as string,
      },
      clientUrlParams: {
        host: $region === "EU" ? "eu-app.contentstack.com" : "app.contentstack.com",
      },
      editButton: {
        enable: true,
      }
    });
  }

  return {
    provide: {
      ContentstackLivePreview,
    },
  };
})

