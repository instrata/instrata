<script setup lang="ts">
import { IconInstrata } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";

const images = ref<string[]>([]);

async function takeScreenshot() {
  images.value.unshift(
      await invoke<string>("capture_screen", { index: 0 })
  );
}
</script>

<template>
  <main class="min-h-svh">
    <div>
      <Button @click="takeScreenshot">
        <IconInstrata />
        Take Screenshot
      </Button>
    </div>

    <img v-for="(imageSrc, i) in images" :key="i" :src="imageSrc" alt="" class="h-40" />
  </main>
</template>
