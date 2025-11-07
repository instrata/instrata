<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { computedAsync } from "@vueuse/core";
import { getRuntimeInfo } from "@/api/commands";
import { Separator } from "@/components/ui/separator";
import { type MaybeRefOrGetter, onMounted, type Ref, toValue } from "vue";
import { Button } from "@/components/ui/button";
import { LucideFolderInput, LucidePen, LucideRefreshCw } from "lucide-vue-next";
import { appConfigDir, appDataDir } from "@tauri-apps/api/path";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useI18n } from "vue-i18n";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { getAppSettingsFileLocation, useAppSettings } from "@/composables/useAppSettings.ts";
import { ScrollArea } from "@/components/ui/scroll-area";

const { t } = useI18n();
const appSettings = useAppSettings();
const { isChecking: isCheckingForUpdate, checkForUpdate, update } = useUpdaterToasts();
const runtimeInfo = computedAsync(getRuntimeInfo);

onMounted(async () => {
  if (appSettings.value.autoCheckForUpdates) {
    await checkForUpdate();
  }
});

async function handleEditSettingsRaw() {
  const fp = await getAppSettingsFileLocation();
  await revealItemInDir(fp);
}

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
    {{ $t('settings.developers.app-settings.heading') }}
  </h2>
  <ScrollArea class="relative max-h-64 border bg-secondary text-secondary-foreground font-mono rounded-md p-0.5">
    <pre>{{ JSON.stringify(appSettings, null, 2) }}</pre>
    <Button variant="outline" size="icon-sm" class="absolute top-0 right-0" @click="handleEditSettingsRaw">
      <LucidePen />
    </Button>
  </ScrollArea>
  <Separator />
  <h2 class="text-lg font-bold">
    {{ $t('settings.developers.locations.heading') }}
  </h2>
  <div>
    <Item v-for="location in locations" size="slim">
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
  <Separator />
  <h2 class="text-lg font-bold">
    {{ $t('settings.developers.update.heading') }}
  </h2>
  <ScrollArea class="relative max-h-64 border bg-secondary text-secondary-foreground font-mono rounded-md p-0.5">
    <pre>{{ JSON.stringify(update, null, 2) }}</pre>
    <Button variant="outline" size="icon-sm" class="absolute top-0 right-0" :disabled="isCheckingForUpdate" @click="checkForUpdate">
      <LucideRefreshCw :class="{ 'animate-spin': isCheckingForUpdate }" />
    </Button>
  </ScrollArea>
</template>
