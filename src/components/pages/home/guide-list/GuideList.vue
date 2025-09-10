<script setup lang="ts">
import { injectHomeContext } from "@/components/pages/home/context.ts";
import GuideListEntry from "./GuideListEntry.vue";

const { guidesAndInfos } = injectHomeContext();
</script>

<template>
  <div class="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1">
    <template v-for="[guide, info] in guidesAndInfos" :key="guide.id">
      <GuideListEntry :guide="guide" :info="info" class="size-full" />
    </template>
  </div>
</template>
