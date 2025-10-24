<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LucideMoon, LucideSun, LucideSunMoon } from "lucide-vue-next";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "@/composables/useAppSettings.ts";
import { Separator } from "@/components/ui/separator";

const colorMode = useColorMode();

const developerMode = useAppSettings("developerMode");
</script>

<template>
  <h2 class="text-lg font-bold">
    {{ $t('settings.general.appearance.heading') }}
  </h2>
  <div class="flex items-center gap-4">
    <span class="mr-auto">
      {{ $t('settings.general.appearance.theme.label') }}
    </span>
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
  </div>
  <Separator />
  <h2 class="text-lg font-bold">
    {{ $t('settings.general.additional-settings.heading') }}
  </h2>
  <div class="flex items-center gap-4">
    <span class="mr-auto">
      {{ $t('settings.general.additional-settings.developer-mode') }}
    </span>
    <Switch v-model="developerMode" />
  </div>
</template>
