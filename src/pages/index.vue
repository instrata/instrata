<script setup lang="ts">
import { TextEditor } from "@/components/text-editor";
import { ref } from "vue";
import type { Guide } from "@/types/data.ts";
import { Input } from "@/components/ui/input";
import { LucideBrushCleaning, LucideCamera } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { captureScreen } from "@/api/commands.ts";
import { nanoid } from "nanoid";

function freshGuide(): Guide {
  return {
    title: "",
    abstract: "",
    steps: [],
    footnote: "",
  }
}

const guide = ref<Guide>(freshGuide());

async function handleTakeScreenshot() {
  const img = await captureScreen();
  guide.value.steps.push({
    id: nanoid(),
    pretext: "",
    screenshot: img,
    posttext: "",
  });
}

async function handleReset() {
  guide.value = freshGuide();
}
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto py-10 space-y-2">
    <div class="flex gap-2">
      <Button @click="handleTakeScreenshot">
        <LucideCamera />
        Take a Screenshot
      </Button>
      <Button variant="secondary" @click="handleReset">
        <LucideBrushCleaning />
        Clear Guide
      </Button>
    </div>
    <Separator />
    <Input v-model="guide.title" placeholder="Title..." />
    <TextEditor v-model="guide.abstract" placeholder="Abstract..." />
    <template v-for="step in guide.steps" :key="step.id">
      <TextEditor v-model="step.pretext" placeholder="Pretext..." />
      <img :src="step.screenshot" :alt="step.id" />
      <TextEditor v-model="step.posttext" placeholder="Posttext..." />
    </template>
    <TextEditor v-model="guide.footnote" placeholder="Footnote..." />
  </main>
</template>
