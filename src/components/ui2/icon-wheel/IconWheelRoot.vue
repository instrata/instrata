<script lang="ts">
import type { Ref } from "vue";
import { createContext } from "reka-ui";

export interface IconWheelRootProps {
  defaultOpen?: boolean
  open?: boolean
  radius?: string
}
export type IconWheelRootEmits = {
  'update:open': [value: boolean]
}

export interface IconWheelRootContext {
  open: Ref<boolean>
  close: () => void
  radius: string
  triggerElement: Ref<HTMLElement | undefined>
  triggerId: string
}

export const [injectIconWheelRootContext, provideIconWheelRootContext]
    = createContext<IconWheelRootContext>("IconWheelRoot");
</script>

<script setup lang="ts">
import { useVModel, onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

const props = withDefaults(defineProps<IconWheelRootProps>(), {
  defaultOpen: false,
  open: undefined,
  radius: `calc(var(--spacing) * 12)`,
});
const emit = defineEmits<IconWheelRootEmits>();

defineSlots<{
  default?: (props: {
    open: typeof open.value
    close: () => void
  }) => any
}>();

const open = useVModel(props, 'open', emit, {
  defaultValue: props.defaultOpen,
  passive: (props.open === undefined) as false,
}) as Ref<boolean>;

function close() {
  open.value = false;
}

const triggerElement = ref<HTMLElement>();
const actionsElement = ref<HTMLElement>();

provideIconWheelRootContext({
  open,
  close,
  radius: props.radius,
  triggerElement,
  triggerId: "",
});

// Close when clicking outside
onClickOutside(triggerElement, () => {
  open.value = false;
});
onClickOutside(actionsElement, () => {
  open.value = false;
});
</script>

<template>
  <div
      role="menu"
      class="group/icon-wheel isolate grid place-items-center"
  >
    <slot
        :open="open"
        :close="close"
    />
  </div>
</template>
