<script setup lang="ts">
import { LucideImageUp, LucidePlus, LucideType, LucideWallpaper } from "lucide-vue-next";
import { IconWheelAction, IconWheelActions, IconWheelRoot, IconWheelTrigger } from "@/components/ui2/icon-wheel";
import { injectAppContext } from "@/components/app/app-context.ts";
import type { ImageNode, Node, TextNode } from "@/types/data.ts";
import { nanoid } from "nanoid";
import { captureScreen } from "@/api/commands";

const props = defineProps<{
  before?: string
}>();

const appContext = injectAppContext();

function insertNode(node: Node) {
  const index = props.before
      ? appContext.guide.value.nodes.findIndex(n => n.id === props.before)
      : appContext.guide.value.nodes.length;
  appContext.guide.value.nodes.splice(index, 0, node);
}

async function handleInsertTextNode() {
  const textNode: TextNode = {
    id: nanoid(),
    type: "text",
    text: "",
  };
  insertNode(textNode);
}

async function handleTakeScreenshot() {
  const screenshotId = await captureScreen(appContext.guide.value.id);
  const imageNode: ImageNode = {
    id: nanoid(),
    type: "image",
    screenshotId: screenshotId,
  };
  insertNode(imageNode);
}

async function handleUploadImage() {

}
</script>

<template>
  <IconWheelRoot>
    <IconWheelTrigger class="group/trigger">
      <LucidePlus class="group-data-[state=open]/trigger:rotate-45 transition-[rotate]" />
    </IconWheelTrigger>
    <IconWheelActions>
      <IconWheelAction @click="handleInsertTextNode">
        <LucideType />
      </IconWheelAction>
      <IconWheelAction @click="handleTakeScreenshot">
        <LucideWallpaper />
      </IconWheelAction>
      <IconWheelAction disabled @click="handleUploadImage">
        <LucideImageUp />
      </IconWheelAction>
    </IconWheelActions>
  </IconWheelRoot>
</template>
