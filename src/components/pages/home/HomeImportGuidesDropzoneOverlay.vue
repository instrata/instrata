<script setup lang="ts">
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LucidePackageOpen } from "lucide-vue-next";
</script>

<template>
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
</template>
