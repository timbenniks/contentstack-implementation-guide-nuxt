<script lang="ts" setup>
// Import the empty block parent class from Contentstack Live Preview utils
import VB_EmptyBlockParentClass from "@contentstack/live-preview-utils";

// Fetch the page data and refresh function using the useGetPage composable
const { data: page, refresh } = await useGetPage("/");

onMounted(() => {
  const { $preview, $ContentstackLivePreview } = useNuxtApp();
  const livePreview = $ContentstackLivePreview as unknown as ContentstackLivePreview;
  $preview && livePreview.onEntryChange(refresh);
});
</script>
<template>
  <main class="max-w-screen-md mx-auto">
    <!-- Main container with conditional classes-->
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
        width="640"
        height="360"
        :src="page?.image.url"
        :alt="page?.image.title"
        v-bind="page?.image?.$ && page?.image?.$.url"
      />

      <div
        v-if="page?.rich_text"
        v-bind="page?.$ && page?.$.rich_text"
        v-html="page?.rich_text"
    />

      <div
        :class="[
          'space-y-8 max-w-screen-sm mt-4',  // Base classes for spacing and width
          !page?.blocks || page.blocks.length === 0 
            ? VB_EmptyBlockParentClass // Add the empty block parent class if no blocks are present
            : '', // Otherwise, no additional class
      ]"
        v-bind="page?.$ && page?.$.blocks"
      >

        <div
          v-for="(item, index) in page?.blocks"
          :key="item.block._metadata.uid"
          v-bind="page?.$ && page?.$[`blocks__${index}`]"
          :class="[
            // Additional classes for each block based on block layout
            'flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-slate-100',
            item.block.layout === 'image_left'
              ? 'md:flex-row'
              : 'md:flex-row-reverse',
          ]"
        >
        <!-- Block content-->
          <div class="w-full md:w-1/2">
            <img
              v-if="item.block.image"
              :src="item.block.image.url"
              :alt="item.block.image.title"
              width="200"
              height="112"
              class="w-full"
              v-bind="item.block.$ && item.block.$.image"
            />
          </div>
          <div class="w-full md:w-1/2">
            <h2
              v-if="item.block.title"
              class="text-2xl font-bold"
              v-bind="item.block.$ && item.block.$.title"
            >
              {{ item.block.title }}
            </h2>
            <div
              v-if="item.block.copy"
              v-html="item.block.copy"
              class="prose"
              v-bind="item.block.$ && item.block.$.copy"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
