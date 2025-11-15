<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { LucideCamera } from "lucide-vue-next";
import { useScreenshotManager } from "@/composables/app/useScreenshotManager.ts";

const { show } = useScreenshotManager({});
</script>

<template>
  <Button variant="secondary" @click="show">
    <LucideCamera />
    {{ $t('app.controls.take-screenshot') }}
  </Button>
</template>
