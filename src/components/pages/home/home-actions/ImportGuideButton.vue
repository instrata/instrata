<script setup lang="ts">
import { LucideImport } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { stat } from "@tauri-apps/plugin-fs";
import { invokeImportGuide } from "@/api/commands";
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { toast } from "vue-sonner";

const { refresh } = useGuideIds();

async function handleImportGuide() {
  const paths = await openDialog({
    multiple: true,
    directory: false,
    filters: [
      { name: "Instrata", extensions: ["zip"] },
    ],
  });
  if (!paths) return;

  for (const path of paths) {
    try {
      const st = await stat(path);
      if (st.isFile) {
        await invokeImportGuide(path);
        // } else if (st.isDirectory) {
        //   await invokeLinkExternalGuide(path);
      } else {
        throw new Error("unsupported path");
      }
    } catch (e) {
      const name = path.match(/[\\\/]?([^\\\/]+)[\\\/]?$/)?.[1] ?? path;
      toast.error(`Failed to import '${name}'`, {
        description: e instanceof Error ? `${e.name}: ${e.message}` : `${e}`,
      });
    }
  }

  await refresh();
}
</script>

<template>
  <Button variant="outline" @click="handleImportGuide">
    <LucideImport />
    {{ $t('home.import-guide') }}
  </Button>
</template>
