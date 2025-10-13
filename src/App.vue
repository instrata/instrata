<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { onMounted } from "vue";

const { checkCanAutoUpdate, checkForUpdate } = useUpdaterToasts();

onMounted(async () => {
  if (import.meta.env.PROD) {
    if (await checkCanAutoUpdate()) {
      try {
        await checkForUpdate();
      } catch (error) {
        console.log("failed to check for updates", error);
      }
    }
  }
});
</script>

<template>
  <router-view :key="$route.path" />
</template>
