<script setup lang="ts">
import { injectAppContext } from "@/components/app/app-context.ts";
import { toast } from "vue-sonner";
import { exportGuideToPdf } from "@/lib/export";
import { toRaw } from "vue";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPdfFile } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@vueuse/core";
import ExportDialogTemplateSelect from "./ExportDialogTemplateSelect.vue";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useI18n } from "vue-i18n";

const appContext = injectAppContext();
const { t } = useI18n();

// todo: handle if saved template was removed
const templateId = useLocalStorage("export-pdf-template-id", "default");

async function handleExportToPdf() {
  const toastId = toast.loading(
      t('app.export-dialog.pdf.toasts.exporting'),
  );
  try {
    await exportGuideToPdf(templateId.value, toRaw(appContext.guide.value));
    toast.success(
        t('app.export-dialog.pdf.toasts.success'),
        { id: toastId },
    );
  } catch (error) {
    console.error(error);
    toast.error(
        t('app.export-dialog.pdf.toasts.error'),
        { id: toastId, description: `${error}` },
    );
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
  <FieldGroup>
    <FieldSet>
      <Field>
        <FieldLabel>
          {{ $t('app.export-dialog.pdf.fields.template.label') }}
        </FieldLabel>
        <ExportDialogTemplateSelect v-model="templateId" format-filter="pdf" />
        <FieldDescription>
          {{ $t('app.export-dialog.pdf.fields.template.description') }}
        </FieldDescription>
      </Field>
    </FieldSet>
  </FieldGroup>
  <DialogFooter>
    <Button @click="handleExportToPdf">
      <IconPdfFile />
      {{ $t('app.export-dialog.common.export') }}
    </Button>
  </DialogFooter>
</template>
