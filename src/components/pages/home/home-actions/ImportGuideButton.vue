<script setup lang="ts">
import { LucideImport } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { useImportHelper } from "@/composables/useImportHelper.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { importPaths } = useImportHelper();

async function handleImportGuide() {
  const paths = await openDialog({
    multiple: true,
    directory: false,
    title: t('home.import-guide.dialog-title'),
    filters: [
      { name: t('home.import-guide.file-category-name'), extensions: ["zip"] },
    ],
  });
  if (!paths) return;

  await importPaths(paths);
}
</script>

<template>
  <Button variant="outline" @click="handleImportGuide">
    <LucideImport />
    {{ $t('home.import-guide.label') }}
  </Button>
</template>
