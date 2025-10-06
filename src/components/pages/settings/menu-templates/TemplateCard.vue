<script setup lang="ts">
import type { TemplateMeta } from "@/api/storage/templates.ts";
import { Badge } from "@/components/ui/badge";
import { LucideExternalLink, LucideFileCode } from "lucide-vue-next";

defineProps<{
  metadata: TemplateMeta,
}>();
</script>

<template>
  <div class="flex items-stretch justify-between gap-3 px-4 py-2 bg-card text-card-foreground border border-border rounded-md break-words overflow-hidden min-w-0 shadow-sm">
    <div class="flex-1 space-y-2 min-w-0">
      <div class="flex items-center gap-2 font-semibold text-lg leading-tight">
        <LucideFileCode class="shrink-0" />
        <span class="min-w-0 line-clamp-1">
          {{ metadata.displayName }}
        </span>
        <Badge v-if="metadata.version" variant="secondary">
          {{ metadata.version }}
        </Badge>
      </div>

      <div class="flex items-center gap-x-1 gap-y-0.5 flex-wrap">
        <template v-for="format in metadata.formats" :key="format">
          <Badge variant="secondary" class="uppercase select-none font-mono break-all whitespace-normal">
            {{ format }}
          </Badge>
        </template>
      </div>

      <div v-if="metadata.description" class="text-sm text-muted-foreground whitespace-normal break-words">
        {{ metadata.description }}
      </div>

      <div v-if="metadata.author" class="text-xs text-muted-foreground break-words">
        by {{ metadata.author }}
      </div>
    </div>
    <div v-if="metadata.links?.length" class="flex flex-col justify-center items-start gap-2">
      <template v-for="link in metadata.links" :key="link">
        <a :href="link.url" target="_blank" rel="noopener noreferrer" :title="link.tooltip ?? link.social" class="bg-secondary p-0.5 rounded-full">
          <img :src="`https://cdn.simpleicons.org/${link.social}`" :alt="link.tooltip ?? link.social" class="size-4 dark:invert" />
        </a>
      </template>
    </div>
  </div>
</template>
