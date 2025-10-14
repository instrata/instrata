<script setup lang="ts">
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { injectAppContext } from "@/components/app/app-context.ts";
import { exportGuideToPdf } from "@/lib/export";
import { toRaw } from "vue";
import { IconPdfFile } from "@/components/icons";

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
  <Button variant="secondary" @click="handleExportToPdf">
    <IconPdfFile />
    {{ $t('app.header.export-pdf') }}
  </Button>
</template>
