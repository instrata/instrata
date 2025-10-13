<script setup lang="ts">
import { LucideFolderInput } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getCustomTemplatesLocation } from "@/api/storage/templates.ts";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

async function openTemplateDirectory() {
  const location = await getCustomTemplatesLocation();
  if (!await exists(location)) {
    await mkdir(location);
  }
  await revealItemInDir(location);
}
</script>

<template>
  <Button variant="outline" size="sm" @click="openTemplateDirectory" :title="$t('settings.templates.open_directory_tooltip')">
    <LucideFolderInput />
  </Button>
</template>
