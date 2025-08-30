<script lang="ts">
import type { PrimitiveProps } from "reka-ui";

export type IconWheelActionProps = PrimitiveProps & {
  index?: number
  total?: number
}
</script>

<script setup lang="ts">
import { Primitive } from "reka-ui";
import { useForwardExpose, useForwardProps } from "reka-ui";
import { injectIconWheelRootContext } from "./IconWheelRoot.vue";
import { computed } from "vue";

const rootContext = injectIconWheelRootContext();

const props = defineProps<IconWheelActionProps>();
const { forwardRef } = useForwardExpose();

const forwarded = useForwardProps(props);

const radiusInPixel = computed(() => {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  el.style.width = rootContext.radius;
  document.body.appendChild(el);
  const px = parseFloat(getComputedStyle(el).width);
  document.body.removeChild(el);
  return px;
})

const openOffset = computed(() => {
  const angleStep = 360 / (radiusInPixel.value / 8);
  const offset = -90;
  const indexDegrees = angleStep * props.index!;
  const endDegrees = angleStep * (props.total! - 1);
  const finalDegrees = indexDegrees - endDegrees / 2;
  const radian = (offset + finalDegrees) * (Math.PI / 180);
  return { x: Math.cos(radian), y: Math.sin(radian), indexDegrees, endDegrees };
});

const selfOffset = computed(() => {
  return rootContext.open.value
    ? openOffset.value
    : { x: 0, y: 0 };
})
</script>

<template>
  <Primitive
      :data-state="rootContext.open.value ? 'open' : 'closed'"
      class="z-10 row-[1] col-[1] transition-transform ease-in-out rounded-full border border-input p-2 shadow-md flex items-center justify-center bg-secondary text-secondary-foreground origin-(--icon-wheel-actions-transform-origin)
data-[state=closed]:pointer-events-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      :style="{
        '--translate-x': `calc(${selfOffset.x} * ${rootContext.radius})`,
        '--translate-y': `calc(${selfOffset.y} * ${rootContext.radius})`,
        transform: `translate(var(--translate-x), var(--translate-y))`,
      }"
      v-bind="forwarded"
      :ref="forwardRef"
  >
    <slot />
  </Primitive>
</template>
