<script setup lang="ts">
import { computedAsync, useMouse, useWindowSize } from "@vueuse/core";
import { invokeListWindows } from "@/api/commands";
import { CropOverlay } from "@/screenshot-overlay/components";
import { computed } from "vue";
import type { WindowInfo } from "@/types/commands.ts";
import { useEventManager } from "@/screenshot-overlay/composables/useEventManager.ts";

const { emitWindowCapture } = useEventManager();
const { width: windowWidth, height: windowHeight } = useWindowSize();
const { x: mouseX, y: mouseY } = useMouse();
const windows = computedAsync(invokeListWindows);

const hoveredWindow = computed<WindowInfo | null>(() => {
  if (!windows.value) return null;

  const res = windows.value.find(w => (
      w.bbox.x <= mouseX.value
      && w.bbox.y <= mouseY.value
      && mouseX.value <= (w.bbox.x + w.bbox.width)
      && mouseY.value <= (w.bbox.y + w.bbox.height)
  )) ?? null;

  console.info(res);
  return res;
});

async function handleClick(): Promise<void> {
  const win = hoveredWindow.value;
  if (!win) return;
  await emitWindowCapture({ windowId: win.id });
}
</script>

<template>
  <CropOverlay
      class="absolute inset-0"
      :style="{ cursor: hoveredWindow ? 'pointer' : 'default' }"
      :size="{
        width: windowWidth,
        height: windowHeight,
      }"
      :crop="hoveredWindow ? {
        x: hoveredWindow.bbox.x,
        y: hoveredWindow.bbox.y,
        width: hoveredWindow.bbox.width,
        height: hoveredWindow.bbox.height,
      } : null"
      @click="handleClick"
  />
</template>
