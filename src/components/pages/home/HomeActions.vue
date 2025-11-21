<script setup lang="ts">
import {
  GuideSearchInput,
  ImportGuideButton,
  NewGuideButton
} from "@/components/pages/home/home-actions";
</script>

<template>
  <div class="flex items-center gap-4">
    <GuideSearchInput class="w-full max-w-sm mr-auto" />
    <ImportGuideButton />
    <NewGuideButton />
  </div>
</template>
