<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { computedAsync } from "@vueuse/core";
import { invokeGetRuntimeInfo } from "@/api/commands";
import { Separator } from "@/components/ui/separator";
import { type MaybeRefOrGetter, onMounted, type Ref, toValue } from "vue";
import { Button } from "@/components/ui/button";
import { LucideFolderInput, LucidePen, LucideRefreshCw } from "lucide-vue-next";
import { appConfigDir, appDataDir, appLogDir } from "@tauri-apps/api/path";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useI18n } from "vue-i18n";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { getAppSettingsFileLocation, useAppSettings } from "@/composables/useAppSettings.ts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBundleType } from "@tauri-apps/api/app";
import { Heading } from "@/components/ui2/heading";

const { t } = useI18n();
const appSettings = useAppSettings();
const { isChecking: isCheckingForUpdate, checkForUpdate, update } = useUpdaterToasts();
const runtimeInfo = computedAsync(invokeGetRuntimeInfo);
const bundleType = computedAsync(getBundleType);

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
  {
    title: () => t('settings.developers.locations.app-logs'),
    path: computedAsync(async () => await appLogDir()),
  },
];
</script>

<template>
  <Heading variant="h2">
    {{ $t('settings.developers.runtime-info.heading') }}
  </Heading>
  <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
    <b>{{ $t('settings.developers.runtime-info.os') }}</b>
    <span>{{ runtimeInfo?.os }}</span>
    <b>{{ $t('settings.developers.runtime-info.arch') }}</b>
    <span>{{ runtimeInfo?.arch }}</span>
    <b>{{ $t('settings.developers.runtime-info.install') }}</b>
    <span>{{ runtimeInfo?.install }}</span>
    <b>{{ $t('settings.developers.runtime-info.bundle-type') }}</b>
    <span>{{ bundleType ?? "-" }}</span>
  </div>
  <Heading variant="h2">
    {{ $t('settings.developers.app-settings.heading') }}
  </Heading>
  <ScrollArea class="relative max-h-64 border bg-secondary text-secondary-foreground font-mono rounded-md p-0.5">
    <pre>{{ JSON.stringify(appSettings, null, 2) }}</pre>
    <Button variant="outline" size="icon-sm" class="absolute top-0 right-0" @click="handleEditSettingsRaw">
      <LucidePen />
    </Button>
  </ScrollArea>
  <Heading variant="h2">
    {{ $t('settings.developers.locations.heading') }}
  </Heading>
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
  <Heading variant="h2">
    {{ $t('settings.developers.update.heading') }}
  </Heading>
  <ScrollArea class="relative max-h-64 border bg-secondary text-secondary-foreground font-mono rounded-md p-0.5">
    <pre>{{ JSON.stringify(update, null, 2) }}</pre>
    <Button variant="outline" size="icon-sm" class="absolute top-0 right-0" :disabled="isCheckingForUpdate" @click="checkForUpdate">
      <LucideRefreshCw :class="{ 'animate-spin': isCheckingForUpdate }" />
    </Button>
  </ScrollArea>
</template>
