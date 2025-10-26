<script setup lang="ts">
import type { TemplateMeta } from "@/api/storage/templates.ts";
import { Badge } from "@/components/ui/badge";
import { LucideFileCode } from "lucide-vue-next";
import { ExternalLink } from "@/components/ui2/external-link";
import { Icon, type IconifyIcon } from "@iconify/vue";
import { getIconData } from "@iconify/utils";
import { icons as SOCIAL_ICONS } from "@iconify-json/simple-icons";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  metadata: TemplateMeta,
}>();
const { locale } = useI18n();

const displayName = computed(() => {
  const displayName = props.metadata.displayName;
  const fallback = props.metadata.id;
  if (typeof displayName === "string")
    return displayName || fallback;
  if (typeof displayName === "object" && displayName !== null && displayName !== undefined)
    return (displayName[locale.value] ?? displayName["en"]) || fallback;
  return fallback;
});
const description = computed(() => {
  const description = props.metadata.description;
  if (typeof description === "string")
    return description;
  if (typeof description === "object" && description !== null && description !== undefined)
    return (description[locale.value] ?? description["en"]);
  return undefined;
});

// material-symbols:error-outline
const unknownSocialFallback: IconifyIcon = {
  "width": 24,
  "height": 24,
  "body": "<path fill=\"currentColor\" d=\"M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8\" />"
}
</script>

<template>
  <div class="flex items-stretch justify-between gap-3 px-4 py-2 bg-card text-card-foreground border border-border rounded-md break-words overflow-hidden min-w-0 shadow-sm">
    <div class="flex-1 space-y-2 min-w-0">
      <div class="flex items-center gap-2 font-semibold text-lg leading-tight">
        <LucideFileCode class="shrink-0" />
        <span class="min-w-0 line-clamp-1">
          {{ displayName }}
        </span>
        <Badge v-if="metadata.version" variant="secondary">
          {{ metadata.version }}
        </Badge>
      </div>

      <div class="flex items-center gap-x-1 gap-y-0.5 flex-wrap">
        <template v-for="format in metadata.formats" :key="format">
          <Badge variant="secondary" class="uppercase select-none font-mono whitespace-normal break-all">
            {{ format }}
          </Badge>
        </template>
      </div>

      <div v-if="description" class="text-sm text-muted-foreground whitespace-normal break-words">
        {{ description }}
      </div>

      <div v-if="metadata.author" class="text-xs text-muted-foreground break-words">
        {{ $t('settings.templates.card.by') }} {{ metadata.author }}
      </div>
    </div>
    <div v-if="metadata.links?.length" class="flex flex-col justify-center items-start gap-2">
      <template v-for="link in metadata.links" :key="link">
        <ExternalLink :href="link.url" :title="link.tooltip ?? link.social">
          <div class="bg-secondary p-0.5 rounded-full cursor-pointer">
            <Icon :icon="getIconData(SOCIAL_ICONS, link.social) ?? unknownSocialFallback" :title="link.tooltip ?? link.social" class="size-5" />
          </div>
        </ExternalLink>
      </template>
    </div>
  </div>
</template>
