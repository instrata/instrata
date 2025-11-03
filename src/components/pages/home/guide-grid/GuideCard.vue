<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { cloneGuide, deleteGuide, getGuideImageFileSrc } from "@/api/storage/guides.ts";
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
import type { Guide, GuideInfo } from "@/types/storage.ts";
import { htmlToText } from "@/lib/utils.ts";
import { exportGuideToArchive } from "@/lib/export/archive.ts";

const props = defineProps<{
  guide: Guide
  info: GuideInfo
}>();

const { refresh: refreshGuideIds } = useGuideIds();

const imagePreviewSrc = computedAsync(async () => {
  const imageNode = props.guide.nodes.find(node => node.type === "image");
  if (!imageNode) return null;
  const filePath = await getGuideImageFileSrc(props.guide.id, imageNode.imageId);
  return convertFileSrc(filePath);
});

async function handleClone() {
  await cloneGuide(props.guide);
  await refreshGuideIds();
}

async function handleGuideExport() {
  await exportGuideToArchive(props.guide.id);
}

async function handleDelete() {
  await deleteGuide(props.guide.id);
  await refreshGuideIds();
}
</script>

<template>
  <div class="relative aspect-video border border-input rounded-lg shadow-md overflow-hidden isolate group/guide-card">
    <router-link :to="{ name: '/(app)/app/[guideId]', params: { guideId: guide.id } }" class="size-full">
      <img v-if="imagePreviewSrc" :src="imagePreviewSrc" alt="preview" class="size-full object-cover group-hover/guide-card:scale-105 transition-[scale]" />
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
        <ExpandableIconMenuAction @click="handleClone" :title="$t('home.card-actions.duplicate')">
          <LucideBookCopy />
        </ExpandableIconMenuAction>
        <ExpandableIconMenuAction @click="handleGuideExport" :title="$t('home.card-actions.export')">
          <LucideFolderDown />
        </ExpandableIconMenuAction>
        <ExpandableIconMenuAction @click="handleDelete" class="hover:text-destructive" :title="$t('home.card-actions.delete')">
          <LucideTrash2 />
        </ExpandableIconMenuAction>
      </ExpandableIconMenuContent>
    </ExpandableIconMenuRoot>
  </div>
</template>
