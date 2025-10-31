<script setup lang="ts">
import { useTemplates } from "@/composables/storage/useTemplates.ts";
import { TemplateCard, RevealTemplateDirectoryButton } from "@/components/pages/settings/menu-templates";
import { computed } from "vue";
import { sortByKey } from "@/lib/utils.ts";
import { useI18n } from "vue-i18n";
import { normalizeMaybeI18nString } from "@/api/storage/templates.ts";

const { locale } = useI18n();
const { templates: rawTemplates } = useTemplates();
const templates = computed(() => sortByKey(
    rawTemplates.value,
    (t) => normalizeMaybeI18nString(t.displayName, locale.value, t.id)
));
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
