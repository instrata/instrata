<script setup lang="ts">
import { cn } from "@/lib/utils.ts";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { useForwardProps, Primitive } from "reka-ui";
import type { PrimitiveProps } from "reka-ui";
import { headingVariants, type HeadingVariants } from ".";

const props = defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class']
  variant: HeadingVariants['variant']
}>();

const delegatedProps = reactiveOmit(props, 'class', 'variant');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive
      role="heading"
      v-bind="forwarded"
      :as="props.variant!"
      :class="cn(headingVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>
