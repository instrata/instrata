<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { computedAsync } from "@vueuse/core";
import { normalizeMaybeI18nString } from "@/api/storage/templates.ts";
import type { ExportFormat } from "@/types/templates.ts";
import { useTemplates } from "@/composables/storage/useTemplates.ts";
import { useI18n } from "vue-i18n";
import { sortByKey } from "@/lib/utils.ts";

const props = defineProps<{
  formatFilter: ExportFormat
}>();

const { locale } = useI18n();
const { templates: allTemplates } = useTemplates();

const templates = computedAsync(async () => {
  return sortByKey(
      allTemplates.value
          .filter(template => template.formats.some(f => f.toLowerCase() === props.formatFilter)),
      (t) => normalizeMaybeI18nString(t.displayName, locale.value, t.id),
  )
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
