<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { findTemplates } from "@/api/storage/templates.ts";
import { TemplateCard, RevealTemplateDirectoryButton } from "@/components/pages/settings/menu-templates";

const templates = computedAsync(findTemplates);
</script>

<template>
  <div class="flex justify-end items-center gap-2">
    <RevealTemplateDirectoryButton />
  </div>
  <div class="flex flex-col gap-2">
    <template v-for="template in templates">
      <TemplateCard :metadata="template" />
    </template>
  </div>
</template>
