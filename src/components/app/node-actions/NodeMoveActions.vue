<script setup lang="ts">
import { injectNodeActionsContext } from "./NodeActions.vue";
import { ExpandableIconMenuAction } from "@/components/ui2/expandable-icon-menu";
import { LucideChevronDown, LucideChevronUp } from "lucide-vue-next";
import { computed } from "vue";
import { injectAppContext } from "@/components/app/app-context.ts";

const appContext = injectAppContext();
const rootContext = injectNodeActionsContext();

const nodeIndex = computed(() => appContext.guide.value.nodes.findIndex(node => node.id === rootContext.nodeId));
const canMoveUp = computed(() => nodeIndex.value > 0);
const canMoveDown = computed(() => nodeIndex.value < (appContext.guide.value.nodes.length-1));

function handleMoveUp() {
  const newIndex = nodeIndex.value - 1;
  const oldIndex = nodeIndex.value;
  [appContext.guide.value.nodes[oldIndex], appContext.guide.value.nodes[newIndex]]
      = [appContext.guide.value.nodes[newIndex]!, appContext.guide.value.nodes[oldIndex]!];
}

function handleMoveDown() {
  const oldIndex = nodeIndex.value;
  const newIndex = nodeIndex.value + 1;
  [appContext.guide.value.nodes[oldIndex], appContext.guide.value.nodes[newIndex]]
      = [appContext.guide.value.nodes[newIndex]!, appContext.guide.value.nodes[oldIndex]!];
}
</script>

<template>
  <ExpandableIconMenuAction :disabled="!canMoveUp" @click="handleMoveUp" :title="$t('app.node-menu.move-up')">
    <LucideChevronUp />
  </ExpandableIconMenuAction>
  <ExpandableIconMenuAction :disabled="!canMoveDown" @click="handleMoveDown" :title="$t('app.node-menu.move-down')">
    <LucideChevronDown />
  </ExpandableIconMenuAction>
</template>
