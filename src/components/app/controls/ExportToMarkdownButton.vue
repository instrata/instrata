<script setup lang="ts">
import { toast } from "vue-sonner";
import { exportGuideToMarkdown } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { injectAppContext } from "@/components/app/app-context.ts";
import { toRaw } from "vue";
import { IconMarkdown } from "@/components/icons";

const appContext = injectAppContext();

async function handleExportToMarkdown() {
  const toastId = toast.loading("Exporting to markdown archive");
  try {
    await exportGuideToMarkdown("markdown", toRaw(appContext.guide.value));
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to markdown archive failed", { id: toastId, description: `${error}` });
  }
}
</script>

<template>
  <Button variant="secondary" @click="handleExportToMarkdown">
    <IconMarkdown />
    Export to Markdown Archive
  </Button>
</template>
