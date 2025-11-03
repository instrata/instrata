<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LucidePackageOpen } from "lucide-vue-next";
import { useDropEvent } from "@/composables/useDropEvent.ts";
import { toast } from "vue-sonner";
import { stat } from "@tauri-apps/plugin-fs";
import { invokeImportGuide } from "@/api/commands";
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";

const { refresh } = useGuideIds();
const { isOverDropZone } = useDropZone(document);

useDropEvent(async ({ paths }) => {
  for (const path of paths) {
    try {
      const fileInfo = await stat(path)
      if (fileInfo.isFile) {
        await invokeImportGuide(path);
      // } else if (fileInfo.isDirectory) {
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
});
</script>

<template>
  <Teleport
    v-if="isOverDropZone"
    to="body"
  >
    <div class="fixed inset-0 z-50 bg-overlay-background/80 p-8">
      <Empty class="h-full border border-overlay-foreground border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon" class="bg-overlay-foreground text-overlay-background">
            <LucidePackageOpen />
          </EmptyMedia>
          <EmptyTitle class="text-overlay-foreground">
            {{ $t('home.import-dropzone.title') }}
          </EmptyTitle>
          <EmptyDescription class="text-overlay-muted-foreground">
            {{ $t('home.import-dropzone.description') }}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  </Teleport>
</template>
