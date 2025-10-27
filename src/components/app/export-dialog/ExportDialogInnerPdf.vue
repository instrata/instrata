<script setup lang="ts">
import { injectAppContext } from "@/components/app/app-context.ts";
import { toast } from "vue-sonner";
import { exportGuideToPdf } from "@/lib/export";
import { toRaw } from "vue";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPdfFile } from "@/components/icons";
import { Button } from "@/components/ui/button";

const appContext = injectAppContext();

async function handleExportToPdf() {
  const toastId = toast.loading("Exporting to pdf");
  try {
    await exportGuideToPdf("default", toRaw(appContext.guide.value));
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to pdf failed", { id: toastId, description: `${error}` })
  }
}
</script>

<template>
  <DialogHeader>
    <DialogTitle>
      {{ $t('app.export-dialog.pdf.title') }}
    </DialogTitle>
    <DialogDescription>
      {{ $t('app.export-dialog.pdf.description') }}
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button @click="handleExportToPdf">
      <IconPdfFile />
      {{ $t('app.export-dialog.common.export') }}
    </Button>
  </DialogFooter>
</template>
