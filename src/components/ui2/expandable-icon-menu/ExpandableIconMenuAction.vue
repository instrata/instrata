<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type ExpandableIconMenuActionProps = PrimitiveProps & {}
</script>

<script setup lang="ts">
import { Primitive, useForwardProps } from "reka-ui";
import { injectExpandableMenuRootContext } from "./ExpandableIconMenuRoot.vue";

const rootContext = injectExpandableMenuRootContext();

const props = withDefaults(defineProps<ExpandableIconMenuActionProps>(), {
  as: 'button',
});
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive
      :data-state="rootContext.open.value ? 'open' : 'closed'"
      :tabindex="rootContext.open.value ? '0' : '-1'"
      v-bind="forwardedProps"
      class="grid place-items-center p-0.5 whitespace-nowrap rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer
ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0
data-[state=closed]:pointer-events-none"
  >
    <slot />
  </Primitive>
</template>
