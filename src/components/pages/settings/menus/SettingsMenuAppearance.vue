<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LucideMoon, LucideSun, LucideSunMoon } from "lucide-vue-next";

const colorMode = useColorMode();
</script>

<template>
  <div class="flex items-center gap-4">
    <span class="mr-auto">
      {{ $t('settings.appearance.theme.label') }}
    </span>
    <Select v-model="colorMode">
      <SelectTrigger size="sm" class="inline-flex">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">
          <LucideSunMoon />
          {{ $t('settings.appearance.theme.system') }}
        </SelectItem>
        <SelectItem value="light">
          <LucideSun />
          {{ $t('settings.appearance.theme.light') }}
        </SelectItem>
        <SelectItem value="dark">
          <LucideMoon />
          {{ $t('settings.appearance.theme.dark') }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
