<!-- 
Main application component that integrates Contentstack CMS with Nuxt.js
This component:
1. Fetches and displays content from Contentstack
2. Supports live preview functionality for content updates
3. Implements responsive layout with dynamic content blocks
4. Handles rich text content and image rendering
Key features:
- Contentstack integration with live preview
- Responsive design with mobile-first approach
- Dynamic content blocks with flexible layouts
- Rich text support with HTML rendering
- Image optimization and responsive sizing
-->
<script lang="ts" setup>
/**
 * Import the empty block parent class from Contentstack Live Preview utils
 * This class is used to style empty block containers in the live preview mode
 */ 
import VB_EmptyBlockParentClass from "@contentstack/live-preview-utils";
/**
 * Fetch the page data and refresh function using the useGetPage composable
 * This gets the content for the root ('/') page from Contentstack
 * 'page' contains all the content data, and 'refresh' is used to update the content
 */ 
const { data: page, refresh } = await useGetPage("/");

// Set up live preview functionality when the component is mounted
onMounted(() => {
  // Get preview utilities from Nuxt app context
  const { $preview, $ContentstackLivePreview } = useNuxtApp();
  // Type assertion for ContentstackLivePreview
  const livePreview = $ContentstackLivePreview as unknown as ContentstackLivePreview;
  // If preview mode is active, set up live content updates
  // This will automatically refresh the page when content changes in Contentstack
  $preview && livePreview.onEntryChange(refresh);
});
</script>
<template>
  <!-- Main content wrapper with max width and center alignment -->
  <main class="max-w-screen-md mx-auto">
    <!-- Content section with padding -->
    <section class="p-4">
      <!-- Page title with live preview binding -->
      <h1
        v-if="page?.title"
        class="text-4xl font-bold mb-4"
        v-bind="page?.$ && page?.$.title"
      >
        {{ page?.title }} with Nuxt
      </h1>
  
      <!-- Page description with live preview binding -->
      <p
        v-if="page?.description"
        class="mb-4"
        v-bind="page?.$ && page?.$.description"
      >
        {{ page?.description }}
      </p>

      <!-- Featured image with responsive dimensions -->
      <img
        v-if="page?.image"
        class="mb-4"
        width="768"
        height="414"
        :src="page?.image.url"
        :alt="page?.image.title"
        v-bind="page?.image?.$ && page?.image?.$.url"
      />

      <!-- Rich text content with HTML rendering -->
      <div
        v-if="page?.rich_text"
        v-bind="page?.$ && page?.$.rich_text"
        v-html="page?.rich_text"
    />

      <!-- Dynamic blocks container with live preview support -->
      <div
        :class="[
          'space-y-8 max-w-full mt-4',
          // Apply empty block class for live preview when no blocks exist
          !page?.blocks || page.blocks.length === 0
            ? VB_EmptyBlockParentClass
            : '',
        ]"
        v-bind="page?.$ && page?.$.blocks"
      >
        <!-- Iterate through content blocks -->
        <div
          v-for="(item, index) in page?.blocks"
          :key="item.block._metadata.uid"
          v-bind="page?.$ && page?.$[`blocks__${index}`]"
          :class="[
            'flex flex-col md:flex-row items-center space-y-4 md:space-y-0 bg-white',
            // Dynamic layout class based on image position preference
            item.block.layout === 'image_left'
              ? 'md:flex-row'
              : 'md:flex-row-reverse',
          ]"
        >
          <!-- Block image section - takes up half width on desktop -->
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
          <!-- Block text content section - takes up half width on desktop -->
          <div class="w-full md:w-1/2 p-4">
            <!-- Block title with live preview binding -->
            <h2
              v-if="item.block.title"
              class="text-2xl font-bold"
              v-bind="item.block.$ && item.block.$.title"
            >
              {{ item.block.title }}
            </h2>
            <!-- Block copy/content with HTML rendering and typography styles -->
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

<style>
body {
  background: #e9e9e9;
}

a {
  text-decoration: underline;
}
</style>
