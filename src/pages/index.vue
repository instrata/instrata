<script setup lang="ts">
import { TextEditor } from "@/components/text-editor";
import { ref } from "vue";

const textContent = ref("");
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto py-10 space-y-2">
    <TextEditor v-model="textContent" placeholder="Write something..." />
    <div class="bg-secondary text-secondary-foreground">
      {{ textContent }}
    </div>
  </main>
</template>
