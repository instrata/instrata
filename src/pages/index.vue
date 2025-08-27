<script setup lang="ts">
import { IconInstrata } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ref } from "vue";
import { captureScreen } from "@/api/commands.ts";
import type { Project } from "@/types/data.ts";

const project = ref<Project>({
  steps: [],
});

async function takeScreenshot() {
  project.value.steps.unshift({
    screenshot: await captureScreen(),
  });
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

    <img v-for="(step, i) in project.steps" :key="i" :src="step.screenshot" alt="" class="h-40" />
  </main>
</template>
