<script setup lang="ts">
import { ref } from "vue";
import type { Guide } from "@/types/data.ts";
import { LucideHome, LucideSettings } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextEditor } from "@/components/app/text-editor";
import { provideAppContext } from "@/components/app/app-context.ts";
import InsertNodeHiddenFlexMenu from "@/components/app/InsertNodeHiddenFlexMenu.vue";
import { TakeScreenshotButton, ExportToMarkdownButton, ExportToPdfButton } from "@/components/app/controls/";
import AutoNode from "@/components/app/nodes/AutoNode.vue";
import { existsGuide, loadGuide, saveGuide } from "@/api/storage/guides.ts";
import { useRoute } from "vue-router";
import { watchThrottled } from "@vueuse/core";
import { toast } from "vue-sonner";
import { NodeActions } from "@/components/app/node-actions";
import { SettingsDialog } from "@/components/pages/settings";

definePage({
  beforeEnter: async (to, _from, next) => {
    const guideId = (to.params as { guideId: string }).guideId;
    if (!await existsGuide(guideId)) {
      toast.error(`Tried to open guide '${guideId}' which does not exist`);
      return false;
    }

    return next();
  },
});

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
    <div class="flex gap-4">
      <TakeScreenshotButton />
      <ExportToMarkdownButton />
      <ExportToPdfButton />
      <div class="flex-1" />
      <router-link :to="{ name: '/' }">
        <Button variant="ghost">
          <LucideHome />
          Home
        </Button>
      </router-link>
      <SettingsDialog>
        <Button variant="ghost">
          <LucideSettings />
          Settings
        </Button>
      </SettingsDialog>
    </div>
    <Separator />
    <TextEditor v-model="guide.title" placeholder="Title..." class="text-2xl" />
    <div class="space-y-1">
      <TextEditor v-model="guide.abstract" placeholder="Abstract..." />
      <template v-for="node in guide.nodes" :key="node.id">
        <InsertNodeHiddenFlexMenu :before="node.id" />
        <div class="group/node relative">
          <AutoNode :node="node" />
          <NodeActions :node-id="node.id" class="absolute top-0 right-0
opacity-0 pointer-events-none transition-opacity delay-100
group-hover/node:pointer-events-auto group-hover/node:opacity-100
data-[state=open]:pointer-events-auto data-[state=open]:opacity-100" />
        </div>
      </template>
      <InsertNodeHiddenFlexMenu />
    </div>
    <TextEditor v-model="guide.footnote" placeholder="Footnote..." />
  </main>
</template>
