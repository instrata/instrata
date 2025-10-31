<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { LucideSearch, LucideX } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { injectHomeContext } from "@/components/pages/home/context.ts";

const { searchString } = injectHomeContext();
</script>

<template>
  <div class="relative">
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
</template>
