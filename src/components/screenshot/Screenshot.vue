<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

const props = defineProps<{
  guideId: string
  screenshotId: string
}>();

const imageUrl = computedAsync(async () => {
  const filePath = await join(await appDataDir(), props.guideId, `${props.screenshotId}.png`);
  return convertFileSrc(filePath);
});
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" :alt="props.screenshotId" />
</template>
