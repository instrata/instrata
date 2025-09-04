<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { onMounted } from "vue";

const { checkForUpdate } = useUpdaterToasts();

onMounted(async () => {
  if (import.meta.env.PROD) {
    try {
      await checkForUpdate();
    } catch (error) {
      console.log(error);
    }
  }
});
</script>

<template>
  <router-view :key="$route.path" />
</template>
