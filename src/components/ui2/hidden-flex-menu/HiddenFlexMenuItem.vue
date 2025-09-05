<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type HiddenFlexMenuItemProps = PrimitiveProps & {};
</script>

<script setup lang="ts">
import { Primitive } from "reka-ui";

withDefaults(defineProps<HiddenFlexMenuItemProps>(), {
  as: "button"
});
</script>

<template>
  <Primitive
      role="menuitem"
      class="inline-flex items-center justify-center gap-1.5 px-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
  >
    <slot />
  </Primitive>
</template>
