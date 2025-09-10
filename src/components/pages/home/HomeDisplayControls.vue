<script setup lang="ts">
import { injectHomeContext } from "@/components/pages/home/context.ts";
import { LucideGrid2x2, LucideList } from "lucide-vue-next";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const { displayMode } = injectHomeContext();
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="font-bold text-lg">
      Your Guides
    </div>
    <div class="grow" />
    <ToggleGroup v-model="displayMode" variant="outline">
      <ToggleGroupItem value="list" title="Display Guides as List">
        <LucideList />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" title="Display Guides as Grid">
        <LucideGrid2x2 />
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
