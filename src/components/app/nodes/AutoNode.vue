<script setup lang="ts">
import type { Node } from "@/types/data.ts";
import TextNode from "@/components/app/nodes/TextNode.vue";
import ImageNode from "@/components/app/nodes/ImageNode.vue";

defineProps<{
  node: Node,
}>();
</script>

<template>
  <TextNode v-if="node.type === 'text'" :node="node" />
  <ImageNode v-else-if="node.type === 'image'" :node="node" />
  <div v-else class="border border-destructive italic">
    UNKNOWN NODE
  </div>
</template>
