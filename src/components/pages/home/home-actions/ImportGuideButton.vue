<script setup lang="ts">
import { LucideImport } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
</script>

<template>
  <Button variant="outline" disabled>
    <LucideImport />
    {{ $t('home.import-guide') }}
  </Button>
</template>
