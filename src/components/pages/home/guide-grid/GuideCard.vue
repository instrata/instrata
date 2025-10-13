<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import {cloneGuide, deleteGuide} from "@/api/storage/guides.ts";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  LucideBookCopy,
  LucideBookImage,
  LucideEllipsisVertical,
  LucideFolderDown,
  LucideTrash2,
  LucideX
} from "lucide-vue-next";
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { ExpandableIconMenuRoot, ExpandableIconMenuTrigger, ExpandableIconMenuContent, ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";
import type { Guide, GuideInfo } from "@/types/data.ts";
import { htmlToText } from "@/lib/utils.ts";

const props = defineProps<{
  guide: Guide
  info: GuideInfo
}>();

const { refresh: refreshGuideIds } = useGuideIds();

const previewScreenshotSrc = computedAsync(async () => {
  const imageNode = props.guide.nodes.find(node => node.type === "image");
  if (!imageNode) return null;
  const filePath = await join(await appDataDir(), "guides", props.guide.id, "screenshots", `${imageNode.screenshotId}.png`);
  return convertFileSrc(filePath);
});

async function handleClone() {
  await cloneGuide(props.guide);
  await refreshGuideIds();
}

async function handleDelete() {
  await deleteGuide(props.guide.id);
  await refreshGuideIds();
}
</script>

<template>
  <div class="relative aspect-video border border-input rounded-lg shadow-md overflow-hidden isolate group/guide-card">
    <router-link :to="{ name: '/(app)/app/[guideId]', params: { guideId: guide.id } }" class="size-full">
      <img v-if="previewScreenshotSrc" :src="previewScreenshotSrc" alt="preview" class="size-full object-cover group-hover/guide-card:scale-105 transition-[scale]" />
      <div v-else class="size-full grid place-items-center">
        <LucideBookImage class="group-hover/guide-card:scale-105 transition-[scale]" />
      </div>
      <div class="absolute inset-x-0 bottom-0 px-1 bg-gradient-to-t from-90% from-background/75 text-foreground line-clamp-2 font-bold break-words">
        {{ htmlToText(guide.title) || guide.id }}
      </div>
    </router-link>
    <ExpandableIconMenuRoot v-slot="{ open }" class="absolute top-0 right-0 shadow-sm">
      <ExpandableIconMenuTrigger>
        <LucideX v-if="open" />
        <LucideEllipsisVertical v-else />
      </ExpandableIconMenuTrigger>
      <ExpandableIconMenuContent>
        <ExpandableIconMenuAction @click="handleClone" title="Duplicate Guide">
          <LucideBookCopy />
        </ExpandableIconMenuAction>
        <ExpandableIconMenuAction disabled title="Export Guide">
          <LucideFolderDown />
        </ExpandableIconMenuAction>
        <ExpandableIconMenuAction @click="handleDelete" class="hover:text-destructive" title="Delete Guide">
          <LucideTrash2 />
        </ExpandableIconMenuAction>
      </ExpandableIconMenuContent>
    </ExpandableIconMenuRoot>
  </div>
</template>
