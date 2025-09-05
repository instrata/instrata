<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type ExpandableIconMenuTriggerProps = PrimitiveProps & {};
</script>

<script setup lang="ts">
import { Primitive } from "reka-ui";
import { injectExpandableMenuRootContext } from "./ExpandableIconMenuRoot.vue";

const rootContext = injectExpandableMenuRootContext();

withDefaults(defineProps<ExpandableIconMenuTriggerProps>(), {
  as: "button",
});
</script>

<template>
  <Primitive
      :type="as === 'button' ? 'button' : undefined"
      aria-haspopup="menu"
      :aria-expanded="rootContext.open.value ? 'open' : 'closed'"
      :as="as"
      :as-child="asChild"
      :data-state="rootContext.open.value ? 'open' : 'closed'"
      @click="rootContext.open.value = !rootContext.open.value"
      class="grid place-items-center p-0.5 whitespace-nowrap rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer
ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
  >
    <slot />
  </Primitive>
</template>
