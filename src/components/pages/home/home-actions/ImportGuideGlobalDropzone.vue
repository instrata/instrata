<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LucidePackageOpen } from "lucide-vue-next";
import { useDropEvent } from "@/composables/useDropEvent.ts";
import { useImportHelper } from "@/composables/useImportHelper.ts";

const { isOverDropZone } = useDropZone(document);
const { importPaths } = useImportHelper();

useDropEvent(async ({ paths }) => {
  await importPaths(paths);
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
