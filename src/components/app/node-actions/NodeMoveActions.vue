<script setup lang="ts">
import { injectNodeActionsContext } from "./NodeActions.vue";
import { ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";
import { LucideChevronDown, LucideChevronUp } from "lucide-vue-next";
import { computed } from "vue";
import { injectAppContext } from "@/components/app/app-context.ts";

const appContext = injectAppContext();
const rootContext = injectNodeActionsContext();

const nodeIndex = computed(() => appContext.guide.value.nodes.findIndex(node => node.id === rootContext.nodeId));

function handleMoveUp() {
  const newIndex = nodeIndex.value - 1;
  const oldIndex = nodeIndex.value;
  [appContext.guide.value.nodes[oldIndex], appContext.guide.value.nodes[newIndex]]
      = [appContext.guide.value.nodes[newIndex], appContext.guide.value.nodes[oldIndex]];
}

function handleMoveDown() {
  const oldIndex = nodeIndex.value;
  const newIndex = nodeIndex.value + 1;
  [appContext.guide.value.nodes[oldIndex], appContext.guide.value.nodes[newIndex]]
      = [appContext.guide.value.nodes[newIndex], appContext.guide.value.nodes[oldIndex]];
}
</script>

<template>
  <ExpandableIconMenuAction :disabled="nodeIndex <= 0" @click="handleMoveUp">
    <LucideChevronUp />
  </ExpandableIconMenuAction>
  <ExpandableIconMenuAction :disabled="nodeIndex >= (appContext.guide.value.nodes.length-1)" @click="handleMoveDown">
    <LucideChevronDown />
  </ExpandableIconMenuAction>
</template>
