<script setup lang="ts">
import { injectNodeActionsContext } from "./NodeActions.vue";
import { ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";
import { LucideTrash2 } from "lucide-vue-next";
import { injectAppContext } from "@/components/app/app-context.ts";
import { computed } from "vue";

const appContext = injectAppContext();
const rootContext = injectNodeActionsContext();

const nodeIndex = computed(() => appContext.guide.value.nodes.findIndex(node => node.id === rootContext.nodeId));

function handleDelete() {
  appContext.guide.value.nodes.splice(nodeIndex.value, 1);
  // todo: respect node type to e.g. delete images
}
</script>

<template>
  <ExpandableIconMenuAction @click="handleDelete" class="hover:text-destructive" :title="$t('app.node-menu.delete')">
    <LucideTrash2 />
  </ExpandableIconMenuAction>
</template>
