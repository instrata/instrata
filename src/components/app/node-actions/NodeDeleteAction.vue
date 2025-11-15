<script setup lang="ts">
import { injectNodeActionsContext } from "./NodeActions.vue";
import { ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";
import { LucideTrash2 } from "lucide-vue-next";
import { injectAppContext } from "@/components/app/app-context.ts";
import { computed } from "vue";
import { deleteImageFromGuide } from "@/api/storage/guides.ts";

const { guide } = injectAppContext();
const rootContext = injectNodeActionsContext();

const nodeIndex = computed(() => guide.value.nodes.findIndex(node => node.id === rootContext.nodeId));

async function handleDelete() {
  const deleted = guide.value.nodes.splice(nodeIndex.value, 1);
  for (const node of deleted) {
    if (node.type === "image") {
      await deleteImageFromGuide(guide.value.id, node.imageId);
    }
  }
}
</script>

<template>
  <ExpandableIconMenuAction @click="handleDelete" class="hover:text-destructive" :title="$t('app.node-menu.delete')">
    <LucideTrash2 />
  </ExpandableIconMenuAction>
</template>
