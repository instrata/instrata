<script setup lang="ts">
import { injectAppContext } from "@/components/app/app-context.ts";
import { toast } from "vue-sonner";
import { exportGuideToMarkdown } from "@/lib/export";
import { toRaw } from "vue";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconMarkdown } from "@/components/icons";
import { useLocalStorage } from "@vueuse/core";
import ExportDialogTemplateSelect from "./ExportDialogTemplateSelect.vue";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useI18n } from "vue-i18n";

const appContext = injectAppContext();
const { t } = useI18n();

// todo: handle if saved template was removed
const templateId = useLocalStorage("export-markdown-template-id", "default");

async function handleExportToMarkdown() {
  const toastId = toast.loading(
      t('app.export-dialog.markdown.toasts.exporting'),
  );
  try {
    await exportGuideToMarkdown(templateId.value, toRaw(appContext.guide.value));
    toast.success(
        t('app.export-dialog.markdown.toasts.success'),
        { id: toastId },
    );
  } catch (error) {
    console.error(error);
    toast.error(
        t('app.export-dialog.markdown.toasts.error'),
        { id: toastId, description: `${error}` },
    );
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
  <FieldGroup>
    <FieldSet>
      <Field>
        <FieldLabel>
          {{ $t('app.export-dialog.markdown.fields.template.label') }}
        </FieldLabel>
        <ExportDialogTemplateSelect v-model="templateId" format-filter="pdf" />
        <FieldDescription>
          {{ $t('app.export-dialog.markdown.fields.template.description') }}
        </FieldDescription>
      </Field>
    </FieldSet>
  </FieldGroup>
  <DialogFooter>
    <Button @click="handleExportToMarkdown">
      <IconMarkdown />
      {{ $t('app.export-dialog.common.export') }}
    </Button>
  </DialogFooter>
</template>
