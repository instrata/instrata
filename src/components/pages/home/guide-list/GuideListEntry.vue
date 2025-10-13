<script setup lang="ts">
import {cloneGuide, deleteGuide} from "@/api/storage/guides.ts";
import {
  LucideBookCopy,
  LucideEye, LucideFolderDown,
  LucideTrash2,
} from "lucide-vue-next";
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { Button } from "@/components/ui/button";
import type { Guide, GuideInfo } from "@/types/data.ts";
import { htmlToText } from "@/lib/utils.ts";

const props = defineProps<{
  guide: Guide
  info: GuideInfo
}>();
const { refresh: refreshGuideIds } = useGuideIds();

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
  <router-link :to="{ name: '/(app)/app/[guideId]', params: { guideId: guide.id } }" class="size-full break-words truncate">
    {{ htmlToText(guide.title) || guide.id }}
  </router-link>
  <div class="flex items-center justify-center gap-1">
    <router-link tabindex="-1" :to="{ name: '/(app)/app/[guideId]', params: { guideId: guide.id } }" class="size-full">
      <Button variant="ghost" size="icon" title="View Guide">
        <LucideEye />
      </Button>
    </router-link>
    <Button variant="ghost" size="icon" @click="handleClone" title="Duplicate Guide">
      <LucideBookCopy />
    </Button>
    <Button variant="ghost" size="icon" disabled title="Export Guide">
      <LucideFolderDown />
    </Button>
    <Button variant="ghost" size="icon" @click="handleDelete" title="Delete Guide">
      <LucideTrash2 />
    </Button>
  </div>
</template>
