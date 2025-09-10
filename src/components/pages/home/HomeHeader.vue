<script setup lang="ts">

import { LucideSettings } from "lucide-vue-next";
import { IconInstrata } from "@/components/icons";
import { Button } from "@/components/ui/button";
</script>

<template>
  <header class="flex items-center">
    <span class="flex items-center justify-center gap-1 font-mono text-lg font-black select-none">
      <IconInstrata />
      Instrata
    </span>
    <div class="grow" />
    <Button variant="ghost" size="sm">
      <LucideSettings />
      Settings
    </Button>
  </header>
</template>
