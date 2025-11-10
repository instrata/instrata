<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { onMounted } from "vue";
import { useAppSettings } from "@/composables/useAppSettings.ts";

const autoCheckForUpdates = useAppSettings("autoCheckForUpdates");
const { checkForUpdate } = useUpdaterToasts();

onMounted(async () => {
  if (autoCheckForUpdates.value) {
    try {
      await checkForUpdate();
    } catch (error) {
      console.error("failed to check for updates", error);
    }
  }
});
</script>

<template>
  <router-view :key="$route.path" />
</template>
