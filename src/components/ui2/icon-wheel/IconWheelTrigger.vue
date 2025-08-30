<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type IconWheelTriggerProps = PrimitiveProps & {}
</script>

<script setup lang="ts">
import { onMounted } from "vue";
import { injectIconWheelRootContext } from "./IconWheelRoot.vue";
import { useId } from "reka-ui";
import { Primitive, useForwardExpose } from "reka-ui";

const props = withDefaults(defineProps<IconWheelTriggerProps>(), {
  as: 'button',
});

const rootContext = injectIconWheelRootContext();

const { forwardRef, currentElement: triggerElement } = useForwardExpose();

rootContext.triggerId ||= useId(undefined, "custom-icon-wheel-trigger");
onMounted(() => {
  rootContext.triggerElement.value = triggerElement.value;
});
</script>

<template>
  <Primitive
      :id="rootContext.triggerId"
      :ref="forwardRef"
      :type="as === 'button' ? 'button' : undefined"
      aria-haspopup="menu"
      :aria-expanded="rootContext.open.value"
      :aria-state="rootContext.open.value ? 'open' : 'closed'"
      :as="as"
      :as-child="props.asChild"
      @click="rootContext.open.value = !rootContext.open.value"
      class="z-20 row-[1] col-[1] rounded-full border border-input p-2 shadow-sm flex items-center justify-center bg-secondary text-secondary-foreground"
  >
    <slot />
  </Primitive>
</template>
