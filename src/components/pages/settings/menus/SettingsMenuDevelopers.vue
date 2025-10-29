<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { computedAsync } from "@vueuse/core";
import { getRuntimeInfo } from "@/api/commands";
import { Separator } from "@/components/ui/separator";
import { type MaybeRefOrGetter, onMounted, type Ref, toValue } from "vue";
import { Button } from "@/components/ui/button";
import { LucideFolderInput } from "lucide-vue-next";
import { appConfigDir, appDataDir } from "@tauri-apps/api/path";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useI18n } from "vue-i18n";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

const { t } = useI18n();
const { checkForUpdate, update } = useUpdaterToasts();
const runtimeInfo = computedAsync(getRuntimeInfo);

onMounted(async () => {
  await checkForUpdate();
});

type Location = {
  title: MaybeRefOrGetter<string>
  path: Ref<string | undefined>
}

const locations: Location[] = [
  {
    title: () => t('settings.developers.locations.app-config'),
    path: computedAsync(async () => await appConfigDir()),
  },
  {
    title: () => t('settings.developers.locations.app-data'),
    path: computedAsync(async () => await appDataDir()),
  },
];
</script>

<template>
  <h2 class="text-lg font-bold">
    {{ $t('settings.developers.locations.heading') }}
  </h2>
  <div>
    <Item v-for="location in locations" size="sm" class="px-0 py-2">
      <ItemContent>
        <ItemTitle>
          {{ toValue(location.title) }}
        </ItemTitle>
        <ItemDescription class="font-mono">
          {{ toValue(location.path) }}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="icon-sm" @click="revealItemInDir(toValue(location.path)!)">
          <LucideFolderInput />
        </Button>
      </ItemActions>
    </Item>
  </div>
  <h2 class="text-lg font-bold">
    {{ $t('settings.developers.runtime-info.heading') }}
  </h2>
  <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
    <span>{{ $t('settings.developers.runtime-info.os') }}</span>
    <div>{{ runtimeInfo?.os }}</div>
    <span>{{ $t('settings.developers.runtime-info.arch') }}</span>
    <div>{{ runtimeInfo?.arch }}</div>
    <span>{{ $t('settings.developers.runtime-info.install') }}</span>
    <div>{{ runtimeInfo?.install }}</div>
  </div>
  <Separator />
  <h2 class="text-lg font-bold">
    {{ $t('settings.developers.update.heading') }}
  </h2>
  <pre>{{ JSON.stringify(update, undefined, 2) }}</pre>
</template>
