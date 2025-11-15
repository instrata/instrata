<script setup lang="ts">
import App from "@/screenshot-overlay/App.vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import { onErrorCaptured } from "vue";

onErrorCaptured((error: Error) => {
  console.error(error);
  alert(`Fatal error occurred:\n${error.name}: ${error.message}`)
});
</script>

<template>
  <TooltipProvider :delay-duration="500">
    <Suspense>
      <App />
    </Suspense>
  </TooltipProvider>
</template>
