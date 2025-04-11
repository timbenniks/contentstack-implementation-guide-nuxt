/**
 * Retrieve Contentstack Page Data
 * 
 * This composable fetches and manages page data from Contentstack CMS using Nuxt's composables.
 * It supports both regular content delivery and live preview functionality.
 * 
 * Features:
 * - Fetches page content based on URL parameter
 * - Supports Contentstack Live Preview mode
 * - Handles data fetching with Nuxt's useAsyncData
 * - Implements type-safe Contentstack queries
 * - Adds editable tags for content management
 * 
 * Usage:
 * const { data, status, refresh } = await useGetPage("/about");
 * 
 * Note: This composable automatically handles preview mode when the 'live_preview' query parameter is present.
 */

import contentstack, { QueryOperation, type LivePreviewQuery } from "@contentstack/delivery-sdk"; // Imports from the Contentstack Content Delivery SDK
import type { Page } from "~/types"; // Import the Page type from the types file

// Define an asynchronous function to fetch page data based on the URL
export const useGetPage = async (url: string) => {
  // Use the useAsyncData hook to fetch data and manage its state
  const { data, status, refresh } = await useAsyncData(`page-${url}`, async () => {
    // Get the Nuxt app instance and the current route
    const { $preview, $stack } = useNuxtApp()
    const route = useRoute()
    const qs = toRaw(route.query) // Convert the route query to a raw object

    // Check if preview mode is enabled and if live preview query parameter is present
    if ($preview && qs?.live_preview) {
      const route = useRoute() // Get the current route again
      const qs = toRaw(route.query)
      $stack.livePreviewQuery(qs as unknown as LivePreviewQuery) // Convert the route query to a raw object again
    }
    // Fetch the page data from Contentstack
    const result = await $stack
      .contentType("page") // Specify the content type as 'page'
      .entry() // Access the entries of the content type
      .query() // Create a query to filter the entries
      .where("url", QueryOperation.EQUALS, url) // Filter entries where the 'url' field matches the provided URL
      .find<Page>(); // Execute the query and cast the result to the Page type

    // Check if there are any entries in the result
    if (result.entries) {
      const entry = result.entries[0] // Get the first entry from the result
        // If preview mode is enabled, add editable tags to the entry
      if ($preview) {
        contentstack.Utils.addEditableTags(entry as Page, 'page', true);
      }

      return entry; // Return the entry as the data
    }

  });
  // Return the data, status, and refresh function from useAsyncData
  return { data, status, refresh }
}