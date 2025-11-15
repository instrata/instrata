<script setup lang="ts">
import { useEventManager } from "@/screenshot-overlay/composables/useEventManager.ts";
import { useOverlayPositioning } from "@/screenshot-overlay/composables/useOverlayPositioning.ts";

useOverlayPositioning();
useEventManager();
</script>

<template>
</template>
