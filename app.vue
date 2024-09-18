<script lang="ts" setup>
import "@contentstack/live-preview-utils/dist/main.css";

const { data: page, refresh } = await useGetPage("/");

onMounted(() => {
  const { $preview, $ContentstackLivePreview } = useNuxtApp();
  $preview && $ContentstackLivePreview.onEntryChange(refresh);
});
</script>
<template>
  <main class="max-w-screen-2xl mx-auto">
    <section class="p-4">
      <h1
        v-if="page?.title"
        class="text-4xl font-bold mb-4"
        v-bind="page?.$ && page?.$.title"
      >
        {{ page?.title }}
      </h1>

      <p
        v-if="page?.description"
        class="mb-4"
        v-bind="page?.$ && page?.$.description"
      >
        {{ page?.description }}
      </p>

      <img
        v-if="page?.image"
        class="mb-4"
        width="300"
        height="300"
        :src="page?.image.url"
        :alt="page?.image.title"
        v-bind="page?.image?.$ && page?.image?.$.url"
      />

      <div
        v-if="page?.rich_text"
        v-bind="page?.$ && page?.$.rich_text"
        v-html="page?.rich_text"
      />
    </section>
  </main>
</template>
