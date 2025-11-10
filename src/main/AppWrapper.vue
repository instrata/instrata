<script setup lang="ts">
import App from "./App.vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { computed, onErrorCaptured } from "vue";
import { toast } from "vue-sonner";
import { useColorMode } from "@vueuse/core";

onErrorCaptured((error: Error) => {
  toast.error("Fatal error occurred.", {
    description: `${error.name}: ${error.message}`,
  });
});

const colorMode = useColorMode({ writeDefaults: false });
const toasterTheme = computed(() => {
  switch (colorMode.value) {
    case "auto": return colorMode.system.value;
    case "dark": return "dark";
    default: return "light";
  }
})
</script>

<template>
  <Toaster rich-colors :theme="toasterTheme" :visible-toasts="5" class="pointer-events-auto" />

  <TooltipProvider :delay-duration="500">
    <Suspense>
      <App />
    </Suspense>
  </TooltipProvider>
</template>
