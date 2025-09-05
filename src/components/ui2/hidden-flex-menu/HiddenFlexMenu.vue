<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type HiddenFlexMenuProps = PrimitiveProps & {};
</script>

<script setup lang="ts">
import { Primitive } from "reka-ui";

withDefaults(defineProps<HiddenFlexMenuProps>(), {
  as: "div"
});
</script>

<template>
  <Primitive
      class="group/hidden-flex-menu flex items-center justify-center h-4"
  >
    <slot />
  </Primitive>
</template>
