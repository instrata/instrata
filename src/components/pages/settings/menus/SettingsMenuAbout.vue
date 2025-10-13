<script setup lang="ts">
import { IconInstrata } from "@/components/icons";
import { getVersion } from "@tauri-apps/api/app";
import { LucideBug, LucideExternalLink, LucideLightbulb } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const APP_VERSION = await getVersion();

const BUG_REPORT_LINK = "https://github.com/instrata/instrata/issues/new?template=bug-report.yaml"
const FEATURE_REQUEST_LINK = "https://github.com/instrata/instrata/issues/new?template=feature-request.yaml"
</script>

<template>
  <h2 class="flex items-center justify-center gap-1 font-mono text-2xl font-black select-none">
    <IconInstrata class="size-8" />
    {{ $t('instrata') }}
  </h2>
  <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
    <span>
      {{ $t('settings.about.version') }}
    </span>
    <div>
      <a :href="`https://github.com/instrata/instrata/releases/tag/v${APP_VERSION}`" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        {{ APP_VERSION }}
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
    <span>
      {{ $t('settings.about.organization') }}
    </span>
    <div>
      <a href="https://github.com/instrata/" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        https://github.com/instrata/
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
    <span>
      {{ $t('settings.about.repository') }}
    </span>
    <div>
      <a href="https://github.com/instrata/instrata/" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        https://github.com/instrata/instrata/
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
  </div>
  <div class="mt-auto" />
  <div class="grid grid-cols-2 place-content-center px-8 gap-8">
    <a class="aspect-video" :href="BUG_REPORT_LINK" target="_blank" rel="noopener noreferrer">
      <Button variant="ghost" size="none" class="size-full flex-col p-2">
        <LucideBug class="size-8" />
        {{ $t('settings.about.report_bug') }}
      </Button>
    </a>
    <a class="aspect-video" :href="FEATURE_REQUEST_LINK" target="_blank" rel="noopener noreferrer">
      <Button variant="ghost" size="none" class="size-full flex-col p-2">
        <LucideLightbulb class="size-8" />
        {{ $t('settings.about.suggest_feature') }}
      </Button>
    </a>
  </div>
  <div class="mt-auto" />
  <div class="text-muted-foreground text-xs text-center select-none">
    {{ $t('settings.about.copyright', { year: new Date().getFullYear() }) }}
  </div>
</template>
