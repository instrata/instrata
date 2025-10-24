<script setup lang="ts">
import { useUpdaterToasts } from "@/composables/useUpdaterToasts.ts";
import { computedAsync } from "@vueuse/core";
import { getRuntimeInfo } from "@/api/commands";
import { Separator } from "@/components/ui/separator";
import { onMounted } from "vue";

const { checkForUpdate, update } = useUpdaterToasts();
const runtimeInfo = computedAsync(getRuntimeInfo);

onMounted(async () => {
  await checkForUpdate();
});
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
    {{ $t('settings.developers.update.heading') }}
  </h2>
  <pre>{{ JSON.stringify(update, undefined, 2) }}</pre>
</template>
