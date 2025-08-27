<script setup lang="ts">
import App from "./App.vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { onErrorCaptured } from "vue";
import { toast } from "vue-sonner";

onErrorCaptured((error: Error) => {
  toast.error("Fatal error occurred.", {
    description: `${error.name}: ${error.message}`,
  });
});
</script>

<template>
  <Toaster rich-colors theme="dark" :visible-toasts="5" class="pointer-events-auto" />

  <TooltipProvider :delay-duration="500">
    <Suspense>
      <App />
    </Suspense>
  </TooltipProvider>
</template>
