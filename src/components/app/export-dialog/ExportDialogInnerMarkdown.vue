<script setup lang="ts">
import { injectAppContext } from "@/components/app/app-context.ts";
import { toast } from "vue-sonner";
import { exportGuideToMarkdown } from "@/lib/export";
import { toRaw } from "vue";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconMarkdown } from "@/components/icons";

const appContext = injectAppContext();

async function handleExportToMarkdown() {
  const toastId = toast.loading("Exporting to markdown archive");
  try {
    await exportGuideToMarkdown("default", toRaw(appContext.guide.value));
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to markdown archive failed", { id: toastId, description: `${error}` });
  }
}
</script>

<template>
  <DialogHeader>
    <DialogTitle>
      {{ $t('app.export-dialog.markdown.title') }}
    </DialogTitle>
    <DialogDescription>
      {{ $t('app.export-dialog.markdown.description') }}
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button @click="handleExportToMarkdown">
      <IconMarkdown />
      {{ $t('app.export-dialog.common.export') }}
    </Button>
  </DialogFooter>
</template>
