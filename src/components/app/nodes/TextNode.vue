<script setup lang="ts">
import { TextEditor } from "@/components/app/text-editor";
import type { TextNode } from "@/types/data.ts";

defineProps<{
  node: TextNode,
}>();
</script>

<template>
  <TextEditor v-model="node.text" placeholder="Write something..." />
</template>
