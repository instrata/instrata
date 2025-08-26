<script setup lang="ts">
import { IconInstrata } from "@/components/icons";
import { Button } from "@/components/ui/button";

function alert(msg: string) {
  window.alert(msg);
}
</script>

<template>
  <main class="grid place-items-center min-h-svh">
    <Button @click="alert('Hello World!')">
      <IconInstrata />
      Hello Instrata
    </Button>
  </main>
</template>
