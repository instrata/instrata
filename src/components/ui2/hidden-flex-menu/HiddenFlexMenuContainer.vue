<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type HiddenFlexMenuContainerProps = PrimitiveProps & {};
</script>

<script setup lang="ts">
import { Primitive } from "reka-ui";

withDefaults(defineProps<HiddenFlexMenuContainerProps>(), {
  as: "div"
});
</script>

<template>
  <Primitive
      role="menu"
      class="flex items-center z-10 justify-center gap-2 px-1 py-0.5 bg-background border border-border rounded-full
transition-opacity opacity-0 group-hover/hidden-flex-menu:opacity-100 pointer-events-none group-hover/hidden-flex-menu:pointer-events-auto duration-100 delay-150"
  >
    <slot />
  </Primitive>
</template>
