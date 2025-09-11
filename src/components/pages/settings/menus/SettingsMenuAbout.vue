<script setup lang="ts">
import { IconInstrata } from "@/components/icons";
import { getVersion } from "@tauri-apps/api/app";
import { LucideExternalLink } from "lucide-vue-next";

const APP_VERSION = await getVersion();
</script>

<template>
  <h2 class="flex items-center justify-center gap-1 font-mono text-2xl font-black select-none">
    <IconInstrata class="size-8" />
    Instrata
  </h2>
  <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
    <span>
      Version:
    </span>
    <div>
      <a :href="`https://github.com/instrata/instrata/releases/tag/v${APP_VERSION}`" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        {{ APP_VERSION }}
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
    <span>
      Organization:
    </span>
    <div>
      <a href="https://github.com/instrata/" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        https://github.com/instrata/
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
    <span>
      Repository:
    </span>
    <div>
      <a href="https://github.com/instrata/instrata/" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center justify-start gap-2 hover:underline">
        https://github.com/instrata/instrata/
        <LucideExternalLink class="size-4 self-start hidden group-hover:inline-block" />
      </a>
    </div>
  </div>
  <div class="mt-auto" />
  <div class="text-muted-foreground text-xs text-center">
    Copyright &copy; {{ new Date().getFullYear() }} Instrata
  </div>
</template>
