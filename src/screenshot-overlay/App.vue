<script setup lang="ts">
import { provideScreenshotOverlayContext, type ScreenshotOverlayMode } from "@/screenshot-overlay/context.ts";
import { type Component, ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { ContextDependentComposables, FloatingMenu, ModeRegion, ModeWindow } from "@/screenshot-overlay/app";

const MODE2COMPONENT: Record<ScreenshotOverlayMode, Component> = {
  region: ModeRegion,
  window: ModeWindow,
};

const visible = ref(false);
const emitterId = ref<string>("");
const mode = useLocalStorage<ScreenshotOverlayMode>("screenshot-overlay-mode", "region");

provideScreenshotOverlayContext({
  visible,
  emitterId,
  mode,
});
</script>

<template>
  <div class="absolute inset-0 bg-black/1" />
  <ContextDependentComposables />
  <component :is="MODE2COMPONENT[mode]" />
  <FloatingMenu />
</template>
