<script setup lang="ts">
import { toast } from "vue-sonner";
import { exportPdf } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { Button } from "@/components/ui/button";
import { injectAppContext } from "@/components/app/app-context.ts";

const appContext = injectAppContext();

async function handleExportToPdf() {
  const toastId = toast.loading("Exporting to pdf");
  try {
    const pdfBlob = await exportPdf("typst", appContext.guide.value);
    startBlobDownload(pdfBlob, "guide.pdf");
    toast.success("Guide successfully exported!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error("Export to pdf failed", { id: toastId, description: `${error}` })
  }
}
</script>

<template>
  <Button variant="secondary" @click="handleExportToPdf">
    Export to PDF
  </Button>
</template>
