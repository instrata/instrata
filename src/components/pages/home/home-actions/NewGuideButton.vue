<script setup lang="ts">
import { createNewGuide } from "@/api/storage/guides.ts";
import { LucidePlus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

async function handleNewGuide() {
  const guide = await createNewGuide();
  await router.push({ name: "/(app)/app/[guideId]", params: { guideId: guide.id } });
}
</script>

<template>
  <Button variant="outline" @click="handleNewGuide">
    <LucidePlus />
    {{ $t('home.new-guide') }}
  </Button>
</template>
