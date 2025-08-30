<script setup lang="ts">
import { TextEditor } from "@/components/text-editor";
import { ref } from "vue";
import type { Guide } from "@/types/data.ts";
import { Input } from "@/components/ui/input";
import { LucideBrushCleaning, LucideCamera } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { captureScreen, exportPdf } from "@/api/commands.ts";
import { nanoid } from "nanoid";
import { exportGuideToMarkdown } from "@/lib/export";
import { TEMPLATE_MARKDOWN } from "@/templates";
import { toast } from "vue-sonner";
import { Screenshot } from "@/components/screenshot";
import { startBlobDownload } from "@/lib/export/utils.ts";

function freshGuide(): Guide {
  return {
    id: "dev",
    title: "",
    abstract: "",
    steps: [],
    footnote: "",
  }
}

const guide = ref<Guide>(freshGuide());

async function handleTakeScreenshot() {
  const screenshotId = await captureScreen(guide.value.id);
  guide.value.steps.push({
    id: nanoid(),
    pretext: "",
    screenshotId: screenshotId,
    posttext: "",
  });
}

async function handleReset() {
  guide.value = freshGuide();
}

async function handleExportToMarkdown() {
  const toastId = toast.loading("Exporting to markdown archive");
  try {
    await exportGuideToMarkdown(TEMPLATE_MARKDOWN, guide.value);
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to markdown archive failed", { id: toastId, description: `${error}` });
  }
}

async function handleExportToPdf() {
  const toastId = toast.loading("Exporting to pdf");
  try {
    const pdfBlob = await exportPdf("typst", guide.value);
    startBlobDownload(pdfBlob, "guide.pdf");
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to pdf failed", { id: toastId, description: `${error}` })
  }
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
      <Button variant="secondary" @click="handleExportToMarkdown">
        Export to Markdown Archive
      </Button>
      <Button variant="secondary" @click="handleExportToPdf">
        Export to PDF
      </Button>
    </div>
    <Separator />
    <Input v-model="guide.title" placeholder="Title..." />
    <TextEditor v-model="guide.abstract" placeholder="Abstract..." />
    <template v-for="step in guide.steps" :key="step.id">
      <TextEditor v-model="step.pretext" placeholder="Pretext..." />
      <Screenshot :guide-id="guide.id" :screenshot-id="step.screenshotId" />
      <TextEditor v-model="step.posttext" placeholder="Posttext..." />
    </template>
    <TextEditor v-model="guide.footnote" placeholder="Footnote..." />
  </main>
</template>
