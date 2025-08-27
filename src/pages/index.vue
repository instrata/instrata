<script setup lang="ts">
import { useAppSettings } from "@/composables/useAppSettings.ts";

const settings = useAppSettings();
</script>

<template>
  <main class="min-h-svh">
    <h1>
      Home
    </h1>
    <div>
      {{ settings }}
    </div>
  </main>
</template>
