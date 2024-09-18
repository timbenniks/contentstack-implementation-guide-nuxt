import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import type { Page } from "~/types";

export const useGetPage = async (url: string) => {
  const { data, status, refresh } = await useAsyncData(`page-${url}`, async () => {
    const { $preview, $stack } = useNuxtApp()
    const result = await $stack
      .contentType("page")
      .entry()
      .query()
      .where("url", QueryOperation.EQUALS, url)
      .find<Page>();

    if (result.entries) {
      const entry = result.entries[0]

      if ($preview) {
        contentstack.Utils.addEditableTags(entry as Page, 'page', true);
      }

      return entry;
    }
  });

  return { data, status, refresh }
}