<script setup lang="ts">
import { Comment, computed, useSlots } from "vue";

const slots = useSlots();

const children = computed(() => {
  const children = slots.default?.() ?? [];
  return children.filter(vnode => vnode.type !== Comment);
});
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
