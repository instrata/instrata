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

const props = withDefaults(defineProps<IconWheelActionProps>(), {
  as: 'button',
});
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

const selfOffset = computed(() => {
  const angleStep = 360 / (radiusInPixel.value / 8);
  const offset = -90;
  const indexDegrees = angleStep * props.index!;
  const endDegrees = angleStep * (props.total! - 1);
  const finalDegrees = indexDegrees - endDegrees / 2;
  const radian = (offset + finalDegrees) * (Math.PI / 180);
  return { x: Math.cos(radian), y: Math.sin(radian), indexDegrees, endDegrees };
});
</script>

<template>
  <Primitive
      :data-state="rootContext.open.value ? 'open' : 'closed'"
      class="z-10 row-[1] col-[1] flex items-center justify-center rounded-full bg-input text-foreground hover:bg-input/90 p-2 border border-background shadow-md cursor-pointer
transition-[translate,scale] will-change-[translate,scale] delay-0 duration-300 ease-in-out disabled:pointer-events-none disabled:text-muted-foreground
data-[state=closed]:pointer-events-none
data-[state=closed]:[--dist:0] data-[state=closed]:scale-0
data-[state=closed]:group-hover/icon-wheel:scale-50 data-[state=closed]:group-hover/icon-wheel:[--dist:0.5] data-[state=closed]:group-hover/icon-wheel:delay-100
data-[state=open]::scale-100 data-[state=open]:[--dist:1]"
      :style="{
        '--translate-x': `calc(${selfOffset.x} * var(--dist) * ${rootContext.radius})`,
        '--translate-y': `calc(${selfOffset.y} * var(--dist) * ${rootContext.radius})`,
        translate: `var(--translate-x) var(--translate-y)`,
      }"
      v-bind="forwarded"
      :ref="forwardRef"
  >
    <slot />
  </Primitive>
</template>
