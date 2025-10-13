<script setup lang="ts">
import { LucideSettings } from "lucide-vue-next";
import { IconInstrata } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/components/pages/settings";
</script>

<template>
  <header class="flex items-center">
    <span class="flex items-center justify-center gap-1 font-mono text-lg font-black select-none">
      <IconInstrata />
      {{ $t('instrata') }}
    </span>
    <div class="grow" />
    <SettingsDialog>
      <Button variant="ghost" size="sm">
        <LucideSettings />
        {{ $t('settings.label') }}
      </Button>
    </SettingsDialog>
  </header>
</template>
