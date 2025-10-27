<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { computedAsync } from "@vueuse/core";
import { findTemplates, normalizeMaybeI18nString } from "@/api/storage/templates.ts";

const props = defineProps<{
  formatFilter: string
}>();

const templates = computedAsync(async () => {
  return (await findTemplates())
      .filter(template => template.formats.includes(props.formatFilter))
});
</script>

<template>
  <Select>
    <SelectTrigger class="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <template v-for="template in templates">
        <SelectItem :value="template.id">
          {{ normalizeMaybeI18nString(template.displayName, $i18n.locale, template.id) }}
        </SelectItem>
      </template>
    </SelectContent>
  </Select>
</template>
