<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { ImageNode } from "@/types/storage.ts";
import { injectAppContext } from "@/components/app/app-context.ts";
import { getGuideImageFileSrc } from "@/api/storage/guides.ts";

const props = defineProps<{
  node: ImageNode,
}>();

const appContext = injectAppContext();

const imageUrl = computedAsync(async () => {
  const filePath = await getGuideImageFileSrc(appContext.guide.value.id, props.node.imageId);
  return convertFileSrc(filePath);
});
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" alt="" />
</template>
