<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { LucideImport, LucidePlus, LucideSearch, LucideX } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { createNewGuide } from "@/api/storage/guides.ts";
import { useRouter } from "vue-router";
import { injectHomeContext } from "@/components/pages/home/context.ts";

const router = useRouter();
const { searchString } = injectHomeContext();

async function handleNewGuide() {
  const guide = await createNewGuide();
  await router.push({ name: "/(app)/app/[guideId]", params: { guideId: guide.id } });
}
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="relative w-full max-w-sm items-center mr-auto">
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <LucideSearch class="size-6 text-muted-foreground" />
      </span>
      <Input v-model="searchString" type="text" :placeholder="$t('home.search-for-guides')" class="px-10" />
      <span class="absolute end-0 inset-y-0 flex items-center justify-center pr-0.5">
        <Button variant="ghost" size="icon" @click="searchString = ''" class="size-8" :title="$t('home.clear-search')">
          <LucideX />
        </Button>
      </span>
    </div>
    <Button variant="outline" disabled>
      <LucideImport />
      {{ $t('home.import-guide') }}
    </Button>
    <Button variant="outline" @click="handleNewGuide">
      <LucidePlus />
      {{ $t('home.new-guide') }}
    </Button>
  </div>
</template>
