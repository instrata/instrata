<script setup lang="ts">
import { toast } from "vue-sonner";
import { exportGuideToMarkdown } from "@/lib/export";
import { TEMPLATE_MARKDOWN } from "@/templates";
import { Button } from "@/components/ui/button";
import { injectAppContext } from "@/components/app/app-context.ts";

const appContext = injectAppContext();

async function handleExportToMarkdown() {
  const toastId = toast.loading("Exporting to markdown archive");
  try {
    await exportGuideToMarkdown(TEMPLATE_MARKDOWN, appContext.guide.value);
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to markdown archive failed", { id: toastId, description: `${error}` });
  }
}
</script>

<template>
  <Button variant="secondary" @click="handleExportToMarkdown">
    Export to Markdown Archive
  </Button>
</template>
