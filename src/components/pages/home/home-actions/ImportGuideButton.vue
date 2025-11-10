<script setup lang="ts">
import { LucideImport } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { useImportHelper } from "@/composables/useImportHelper.ts";

const { importPaths } = useImportHelper();

async function handleImportGuide() {
  const paths = await openDialog({
    multiple: true,
    directory: false,
    filters: [
      { name: "Instrata", extensions: ["zip"] },
    ],
  });
  if (!paths) return;

  await importPaths(paths);
}
</script>

<template>
  <Button variant="outline" @click="handleImportGuide">
    <LucideImport />
    {{ $t('home.import-guide') }}
  </Button>
</template>
