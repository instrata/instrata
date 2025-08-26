<script setup lang="ts">
import App from "./App.vue";
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
  <Toaster class="pointer-events-auto" />

  <Suspense>
    <App />
  </Suspense>
</template>
