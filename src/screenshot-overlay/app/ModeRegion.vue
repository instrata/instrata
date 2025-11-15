<script setup lang="ts">
import { CropOverlay } from "@/screenshot-overlay/components";
import { useWindowSize } from "@vueuse/core";
import { ref } from "vue";
import type { BBox } from "@/types/common.ts";
import { useEventManager } from "@/screenshot-overlay/composables/useEventManager.ts";

const { emitRegionCapture } = useEventManager();
const { width: windowWidth, height: windowHeight } = useWindowSize();

type Position = { x: number; y: number }

const startPosition = ref<Position | null>(null);
const crop = ref<BBox | null>(null);

function calculateCropArea(a: Position, b: Position): BBox {
  const [x, y] = [Math.min(a.x, b.x), Math.min(a.y, b.y)]
  return {
    x, y,
    width: Math.max(a.x, b.x) - x,
    height: Math.max(a.y, b.y) - y,
  };
}

function handleStart(event: MouseEvent): void {
  startPosition.value = { x: event.clientX, y: event.clientY };
}

function handleMove(event: MouseEvent): void {
  if (!startPosition.value) return;
  crop.value = calculateCropArea(startPosition.value, { x: event.clientX, y: event.clientY });
}

async function handleUp(event: MouseEvent): Promise<void> {
  if (!startPosition.value) return;
  const region: BBox = calculateCropArea(startPosition.value, { x: event.clientX, y: event.clientY });
  crop.value = null;
  startPosition.value = null;
  await emitRegionCapture({ region });
}
</script>

<template>
  <CropOverlay
      class="absolute inset-0 cursor-crosshair"
      :size="{
        width: windowWidth,
        height: windowHeight,
      }"
      :crop="crop"
      @mousedown="handleStart"
      @mousemove="handleMove"
      @mouseup="handleUp"
  />
</template>
