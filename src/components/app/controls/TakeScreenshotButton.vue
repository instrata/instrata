<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { LucideCamera } from "lucide-vue-next";
import { captureScreen } from "@/api/commands";
import { nanoid } from "nanoid";
import { injectAppContext } from "@/components/app/app-context.ts";
import type { ImageNode } from "@/types/data.ts";

const appContext = injectAppContext();

async function handleTakeScreenshot() {
  const screenshotId = await captureScreen(appContext.guide.value.id);
  const imageNode: ImageNode = {
    id: nanoid(),
    type: "image",
    screenshotId: screenshotId,
  };
  appContext.guide.value.nodes.push(imageNode);
}
</script>

<template>
  <Button @click="handleTakeScreenshot">
    <LucideCamera />
    Take a Screenshot
  </Button>
</template>
