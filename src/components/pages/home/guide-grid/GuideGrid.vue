<script setup lang="ts">
import { injectHomeContext } from "@/components/pages/home/context.ts";
import GuideCard from "./GuideCard.vue";

const { guidesAndInfos } = injectHomeContext();
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
    <template v-for="[guide, info] in guidesAndInfos" :key="guide.id">
      <GuideCard :guide="guide" :info="info" class="size-full" />
    </template>
  </div>
</template>
