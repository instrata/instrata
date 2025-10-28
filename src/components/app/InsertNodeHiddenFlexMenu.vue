<script setup lang="ts">
import { LucideImageUp, LucideTypeOutline, LucideWallpaper } from "lucide-vue-next";
import { injectAppContext } from "@/components/app/app-context.ts";
import type { ImageNode, Node, TextNode } from "@/types/storage.ts";
import { nanoid } from "nanoid";
import { captureScreen } from "@/api/commands";
import { HiddenFlexMenu, HiddenFlexMenuContainer, HiddenFlexMenuItem, HiddenFlexMenuSeparator } from "@/components/ui2/hidden-flex-menu";

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
    imageId: screenshotId,
  };
  insertNode(imageNode);
}

async function handleUploadImage() {

}
</script>

<template>
  <HiddenFlexMenu>
    <HiddenFlexMenuContainer>
      <HiddenFlexMenuItem @click="handleInsertTextNode">
        <LucideTypeOutline />
        Text
      </HiddenFlexMenuItem>
      <HiddenFlexMenuSeparator />
      <HiddenFlexMenuItem @click="handleTakeScreenshot">
        <LucideWallpaper />
        Screenshot
      </HiddenFlexMenuItem>
      <HiddenFlexMenuSeparator />
      <HiddenFlexMenuItem disabled @click="handleUploadImage">
        <LucideImageUp />
        Image
      </HiddenFlexMenuItem>
    </HiddenFlexMenuContainer>
  </HiddenFlexMenu>
</template>
