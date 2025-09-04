<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { ImageNode } from "@/types/data.ts";
import { injectAppContext } from "@/components/app/app-context.ts";

const props = defineProps<{
  node: ImageNode,
}>();

const appContext = injectAppContext();

const imageUrl = computedAsync(async () => {
  const filePath = await join(await appDataDir(), "guides", appContext.guide.value.id, "screenshots", `${props.node.screenshotId}.png`);
  return convertFileSrc(filePath);
});
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" alt="" />
</template>
