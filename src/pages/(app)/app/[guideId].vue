<script setup lang="ts">
import { ref } from "vue";
import type { Guide } from "@/types/data.ts";
import { LucideHome } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextEditor } from "@/components/app/text-editor";
import { provideAppContext } from "@/components/app/app-context.ts";
import InsertNodeIconWheel from "@/components/app/InsertNodeIconWheel.vue";
import { TakeScreenshotButton, ExportToMarkdownButton, ExportToPdfButton } from "@/components/app/controls/";
import AutoNode from "@/components/app/nodes/AutoNode.vue";
import { loadGuide, saveGuide } from "@/api/storage/guides.ts";
import { useRoute } from "vue-router";
import { watchThrottled } from "@vueuse/core";

const route = useRoute("/(app)/app/[guideId]");

const guide = ref<Guide>(await loadGuide(route.params.guideId));

watchThrottled(guide, async (newGuide) => {
  await saveGuide(newGuide);
}, { throttle: 100, deep: true });

provideAppContext({
  guide: guide,
});
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto p-2 space-y-2">
    <div class="flex gap-2">
      <router-link :to="{ name: '/' }">
        <Button variant="secondary">
          <LucideHome />
          Home
        </Button>
      </router-link>
      <TakeScreenshotButton />
      <ExportToMarkdownButton />
      <ExportToPdfButton />
    </div>
    <Separator />
    <TextEditor v-model="guide.title" placeholder="Title..." class="text-2xl" />
    <TextEditor v-model="guide.abstract" placeholder="Abstract..." />
    <template v-for="node in guide.nodes" :key="node.id">
      <div class="grid place-items-center">
        <InsertNodeIconWheel :before="node.id" />
      </div>
      <AutoNode :node="node" />
    </template>
    <div class="grid place-items-center">
      <InsertNodeIconWheel />
    </div>
    <TextEditor v-model="guide.footnote" placeholder="Footnote..." />
  </main>
</template>
