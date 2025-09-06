<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { deleteGuide, loadGuide } from "@/api/storage/guides.ts";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { LucideBookImage, LucideEllipsisVertical, LucideTrash2, LucideX } from "lucide-vue-next";
import { computed } from "vue";
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { ExpandableIconMenuRoot, ExpandableIconMenuTrigger, ExpandableIconMenuContent, ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";

const props = defineProps<{
  guideId: string
}>();

const { refresh: refreshGuideIds } = useGuideIds();
const guide = computedAsync(async () => await loadGuide(props.guideId));

const cleanTitle = computed(() => {
  if (!guide.value) return undefined;
  const doc = new DOMParser().parseFromString(guide.value.title, "text/html");
  return doc.documentElement.textContent;
});

const previewScreenshotSrc = computedAsync(async () => {
  if (!guide.value) return undefined;
  const imageNode = guide.value.nodes.find(node => node.type === "image");
  if (!imageNode) return null;
  const filePath = await join(await appDataDir(), "guides", props.guideId, "screenshots", `${imageNode.screenshotId}.png`);
  return convertFileSrc(filePath);
});

async function handleDelete() {
  await deleteGuide(props.guideId);
  await refreshGuideIds()
}
</script>

<template>
  <div v-if="guide" class="relative aspect-video border border-input rounded-lg overflow-hidden isolate group/guide-card">
    <router-link :to="{ name: '/(app)/app/[guideId]', params: { guideId: guideId } }" class="size-full">
      <img v-if="previewScreenshotSrc" :src="previewScreenshotSrc" alt="preview" class="size-full object-cover group-hover/guide-card:scale-105 transition-[scale]" />
      <div v-else class="size-full grid place-items-center">
        <LucideBookImage class="group-hover/guide-card:scale-105 transition-[scale]" />
      </div>
      <div class="absolute inset-x-0 bottom-0 px-1 bg-gradient-to-t from-75% from-secondary/50 line-clamp-2 font-bold break-words">
        {{ cleanTitle || guideId }}
      </div>
    </router-link>
    <ExpandableIconMenuRoot v-slot="{ open }" class="absolute top-0 right-0">
      <ExpandableIconMenuTrigger>
        <LucideX v-if="open" />
        <LucideEllipsisVertical v-else />
      </ExpandableIconMenuTrigger>
      <ExpandableIconMenuContent>
        <ExpandableIconMenuAction @click="handleDelete" class="hover:text-destructive">
          <LucideTrash2 />
        </ExpandableIconMenuAction>
      </ExpandableIconMenuContent>
    </ExpandableIconMenuRoot>
  </div>
</template>
