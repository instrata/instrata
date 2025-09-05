<script lang="ts">
export type ExpandableIconMenuContentProps = {}
</script>

<script setup lang="ts">
import { injectExpandableMenuRootContext } from "./ExpandableIconMenuRoot.vue";
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

const rootContext = injectExpandableMenuRootContext();

defineProps<ExpandableIconMenuContentProps>();

const currentElement = useTemplateRef("contentRef");

const height = ref(0);

const isOpen = computed(() => rootContext.open.value);

watch(isOpen, async () => {
  await nextTick();
  const node = currentElement.value;
  if (!node) return;

  const rect = node.getBoundingClientRect();
  height.value = rect.height;
}, { immediate: true });
</script>

<template>
  <div
      :data-state="rootContext.open.value ? 'open' : 'closed'"
      class="transition-[height] h-[var(--height)] data-[state=closed]:h-0 overflow-hidden"
      :style="{
        '--height': `${height}px`
      }"
  >
    <div
        v-bind="$attrs"
        :data-state="rootContext.open.value ? 'open' : 'closed'"
        ref="contentRef"
        class="pt-0.5 flex flex-col gap-0.5 items-center justify-center"
    >
      <slot />
    </div>
  </div>
</template>
