<script setup lang="ts">
import { ref } from "vue";
import type { Guide } from "@/types/data.ts";
import { Input } from "@/components/ui/input";
import {
  LucideBrushCleaning,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextEditor } from "@/components/app/text-editor";
import { provideAppContext } from "@/components/app/app-context.ts";
import InsertNodeIconWheel from "@/components/app/InsertNodeIconWheel.vue";
import { TakeScreenshotButton, ExportToMarkdownButton, ExportToPdfButton } from "@/components/app/controls/";
import AutoNode from "@/components/app/nodes/AutoNode.vue";

function freshGuide(): Guide {
  return {
    id: "dev",
    title: "",
    abstract: "",
    nodes: [],
    footnote: "",
  }
}

const guide = ref<Guide>(freshGuide());

provideAppContext({
  guide: guide,
});

async function handleReset() {
  guide.value = freshGuide();
}
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto p-2 space-y-2">
    <div class="flex gap-2">
      <TakeScreenshotButton />
      <Button variant="secondary" @click="handleReset">
        <LucideBrushCleaning />
        Clear Guide
      </Button>
      <ExportToMarkdownButton />
      <ExportToPdfButton />
    </div>
    <Separator />
    <Input v-model="guide.title" placeholder="Title..." />
    <TextEditor v-model="guide.abstract" placeholder="Abstract..." />
    <template v-for="node in guide.nodes" :key="node.id">
      <div class="grid place-items-center">
        <InsertNodeIconWheel :before="node.id" />
      </div>
      <AutoNode :node="node" />
    </template>
    <div class="grid place-items-center">
      <InsertNodeIconWheel />
    </div>
    <TextEditor v-model="guide.footnote" placeholder="Footnote..." />
  </main>
</template>
