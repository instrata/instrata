<script setup lang="ts">
import { LucideImageUp, LucideTypeOutline, LucideWallpaper } from "lucide-vue-next";
import { injectAppContext } from "@/components/app/app-context.ts";
import type { ImageNode, Node, TextNode } from "@/types/storage.ts";
import { nanoid } from "nanoid";
import { HiddenFlexMenu, HiddenFlexMenuContainer, HiddenFlexMenuItem, HiddenFlexMenuSeparator } from "@/components/ui2/hidden-flex-menu";
import { open as openFileDialog } from "@tauri-apps/plugin-dialog";
import { importImageToGuide } from "@/api/storage/guides.ts";
import { useScreenshotManager } from "@/composables/app/useScreenshotManager.ts";

const props = defineProps<{
  before?: string
}>();

const { guide } = injectAppContext();
const { show: showScreenshotOverlay } = useScreenshotManager({
  beforeNodeId: props.before,
});

function insertNode(node: Node) {
  const index = props.before
      ? guide.value.nodes.findIndex(n => n.id === props.before)
      : guide.value.nodes.length;
  guide.value.nodes.splice(index, 0, node);
}

async function handleInsertTextNode() {
  const textNode: TextNode = {
    id: nanoid(),
    type: "text",
    text: "",
  };
  insertNode(textNode);
}

async function handleUploadImage() {
  const files = await openFileDialog({
    multiple: true,
    directory: false,
    filters: [{
      name: "Images",
      extensions: ["png"],
    }],
  });
  if (files === null) return;
  for (const file of files) {
    const imageId = await importImageToGuide(file, guide.value.id);
    const imageNode: ImageNode = {
      id: nanoid(),
      type: "image",
      imageId,
    };
    insertNode(imageNode);
  }
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
      <HiddenFlexMenuItem @click="showScreenshotOverlay">
        <LucideWallpaper />
        Screenshot
      </HiddenFlexMenuItem>
      <HiddenFlexMenuSeparator />
      <HiddenFlexMenuItem @click="handleUploadImage">
        <LucideImageUp />
        Image
      </HiddenFlexMenuItem>
    </HiddenFlexMenuContainer>
  </HiddenFlexMenu>
</template>
