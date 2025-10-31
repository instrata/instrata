<script setup lang="ts">
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { GuideGrid, GuideList, HomeActions, HomeDisplayControls, HomeHeader } from "@/components/pages/home";
import { loadGuide, loadGuideInfo } from "@/api/storage/guides.ts";
import { computedAsync, useLocalStorage } from "@vueuse/core";
import { provideHomeContext } from "@/components/pages/home/context.ts";
import { computed, ref } from "vue";
import { htmlToText } from "@/lib/utils.ts";

const { guideIds } = useGuideIds();
const displayMode = useLocalStorage<"grid" | "list">("home-display-mode", "grid");
const searchString = ref("");

const guidesAndInfos = computedAsync(async () => {
  const result = await Promise.all(guideIds.value.map(async (guideId) => {
    try {
      return await Promise.all([
        loadGuide(guideId),
        loadGuideInfo(guideId),
      ]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }));
  return result.filter(g => g !== null);
});

const filteredGuidesAndInfos = computed(() => {
  if (!guidesAndInfos.value) return [];
  const term = searchString.value.toLocaleLowerCase();
  return guidesAndInfos.value.filter(([guide]) => {
    const title = htmlToText(guide.title);
    return (title ? title : guide.id).toLocaleLowerCase().includes(term);
  });
});

const sortedAndFilteredGuidesAndInfos = computed(() => {
  return filteredGuidesAndInfos.value.sort(([_g1, i1], [_g2, i2]) => {
    if (i1.mtime !== null && i2.mtime !== null) {
      return i2.mtime.getTime() - i1.mtime.getTime();
    } else if (i1.mtime === null) {
      return 1;
    } else if (i2.mtime === null) {
      return -1;
    } else {
      return 0;
    }
  });
});

provideHomeContext({
  displayMode,
  guidesAndInfos: sortedAndFilteredGuidesAndInfos,
  searchString,
});
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto p-2 space-y-4">
    <HomeHeader />
    <HomeActions />
    <HomeDisplayControls />
    <GuideGrid v-if="displayMode === 'grid'" />
    <GuideList v-else-if="displayMode === 'list'" />
  </main>
</template>
