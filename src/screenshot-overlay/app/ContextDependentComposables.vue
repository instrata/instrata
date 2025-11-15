<script setup lang="ts">
import { useOverlayPositioning } from "@/screenshot-overlay/composables/useOverlayPositioning.ts";
import { useEventManager } from "@/screenshot-overlay/composables/useEventManager.ts";
import { useAutoDestroy } from "@/screenshot-overlay/composables/useAutoDestroy.ts";

useOverlayPositioning();
useEventManager();
useAutoDestroy();
</script>

<template>

</template>
