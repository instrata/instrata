<script setup lang="ts">
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { LucideAppWindow, LucideCrop, LucideMonitor, LucideX } from "lucide-vue-next";
import { injectScreenshotOverlayContext } from "@/screenshot-overlay/context.ts";
import { useHoveredMonitor } from "@/screenshot-overlay/composables/useHoveredMonitor.ts";
import { useEventManager } from "@/screenshot-overlay/composables/useEventManager.ts";

const { visible, mode } = injectScreenshotOverlayContext();
const hoveredMonitor = useHoveredMonitor();
const { emitMonitorCapture } = useEventManager();

async function handleMonitor() {
  await emitMonitorCapture({
    monitorName: hoveredMonitor.value!.name!,
  });
}

function handleWindow() {
  mode.value = "window";
}

function handleRegion() {
  mode.value = "region";
}

function handleCancel() {
  visible.value = false;
}
</script>

<template>
  <ButtonGroup
      class="absolute -translate-x-1/2 z-20"
      :style="{
        left: `calc(${hoveredMonitor?.position.x ?? 0}px + ${(hoveredMonitor?.size.width ?? 100) / 2}px)`,
        top: `calc(${hoveredMonitor?.position.y ?? 100}px + var(--spacing) * 4)`,
      }"
  >
    <Button variant="outline" size="icon-sm" @click="handleMonitor">
      <LucideMonitor />
    </Button>
    <Button :variant="mode === 'window' ? 'secondary' : 'outline'" size="icon-sm" @click="handleWindow">
      <LucideAppWindow />
    </Button>
    <Button :variant="mode === 'region' ? 'secondary' : 'outline'" size="icon-sm" @click="handleRegion">
      <LucideCrop />
    </Button>
    <Button variant="outline" size="icon-sm" @click="handleCancel">
      <LucideX />
    </Button>
  </ButtonGroup>
</template>
