<script setup lang="ts">
import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { GuideCard } from "@/components/pages/home";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-vue-next";
import { createNewGuide } from "@/api/storage/guides.ts";
import { useRouter } from "vue-router";

const router = useRouter();
const { guideIds } = useGuideIds();

async function handleNewGuide() {
  const guide = await createNewGuide();
  await router.push({ name: "/(app)/app/[guideId]", params: { guideId: guide.id } });
}
</script>

<template>
  <main class="min-h-svh max-w-5xl mx-auto p-2 space-y-2">
    <div class="flex justify-end">
      <Button variant="secondary" @click="handleNewGuide">
        <LucidePlus />
        New Guide
      </Button>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
      <template v-for="guideId in guideIds" :key="guideId">
        <GuideCard :guide-id="guideId" class="size-full" />
      </template>
    </div>
  </main>
</template>
