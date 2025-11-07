<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LucideMoon, LucideRefreshCw, LucideSun, LucideSunMoon } from "lucide-vue-next";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "@/composables/useAppSettings.ts";
import { Separator } from "@/components/ui/separator";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { toast } from "vue-sonner";

const { update, checkForUpdate, isChecking } = useUpdaterToasts();
const colorMode = useColorMode();
const appSettings = useAppSettings();

async function handleCheckForUpdate() {
  await checkForUpdate();
  if (!update.value) {
    toast.info("No updates available");
  }
}
</script>

<template>
  <Item size="slim">
    <ItemContent>
      <ItemTitle>
        {{ $t('settings.general.appearance.title') }}
      </ItemTitle>
      <ItemDescription>
        {{ $t('settings.general.appearance.description') }}
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <Select v-model="colorMode">
        <SelectTrigger size="sm" class="inline-flex">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">
            <LucideSunMoon />
            {{ $t('settings.general.appearance.theme.system') }}
          </SelectItem>
          <SelectItem value="light">
            <LucideSun />
            {{ $t('settings.general.appearance.theme.light') }}
          </SelectItem>
          <SelectItem value="dark">
            <LucideMoon />
            {{ $t('settings.general.appearance.theme.dark') }}
          </SelectItem>
        </SelectContent>
      </Select>
    </ItemActions>
  </Item>
  <Item size="slim">
    <ItemContent>
      <ItemTitle>
        {{ $t('settings.general.updates.title') }}
      </ItemTitle>
      <ItemDescription>
        {{ $t('settings.general.updates.description') }}
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button variant="ghost" size="icon" :disabled="isChecking" @click="handleCheckForUpdate">
        <LucideRefreshCw :class="{ 'animate-spin': isChecking }" />
      </Button>
      <Switch v-model="appSettings.autoCheckForUpdates" />
    </ItemActions>
  </Item>
  <Separator />
  <Item size="slim">
    <ItemContent>
      <ItemTitle>
        {{ $t('settings.general.developer-mode.title') }}
      </ItemTitle>
      <ItemDescription>
        {{ $t('settings.general.developer-mode.description') }}
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <Switch v-model="appSettings.developerMode" />
    </ItemActions>
  </Item>
</template>
