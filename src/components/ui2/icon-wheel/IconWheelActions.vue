<script setup lang="ts">
import { computed, useSlots } from "vue";

const slots = useSlots();

const children = computed(() => slots.default?.() ?? []);
const total = computed(() => children.value.length);
</script>

<template>
  <template v-for="(child, index) in children" :key="child.key ?? index">
    <component
      :is="child"
      v-bind="{ index, total }"
    />
  </template>
</template>
