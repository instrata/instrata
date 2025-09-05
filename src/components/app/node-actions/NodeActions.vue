<script lang="ts">
import { createContext } from "reka-ui";

type NodeActionsContext = {
  nodeId: string
}

export const [injectNodeActionsContext, provideNodeActionsContext]
    = createContext<NodeActionsContext>("NodeActions");
</script>

<script setup lang="ts">
import {
  ExpandableIconMenuContent,
  ExpandableIconMenuRoot,
  ExpandableIconMenuTrigger
} from "@/components/ui2/expandable-icon-menu";
import { LucideEllipsisVertical, LucideX } from "lucide-vue-next";
import NodeDeleteAction from "./NodeDeleteAction.vue";
import NodeMoveActions from "./NodeMoveActions.vue";

const props = defineProps<{
  nodeId: string
}>();

provideNodeActionsContext({
  nodeId: props.nodeId,
});
</script>

<template>
  <ExpandableIconMenuRoot v-slot="{ open }">
    <ExpandableIconMenuTrigger>
      <LucideX v-if="open" />
      <LucideEllipsisVertical v-else />
    </ExpandableIconMenuTrigger>
    <ExpandableIconMenuContent>
      <NodeMoveActions />
      <NodeDeleteAction />
    </ExpandableIconMenuContent>
  </ExpandableIconMenuRoot>
</template>
