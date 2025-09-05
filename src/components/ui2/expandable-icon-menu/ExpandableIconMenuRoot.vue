<script lang="ts">
import { type Ref } from "vue";
import { createContext } from "reka-ui";

export type ExpandableIconMenuRootProps = {
  defaultOpen?: boolean
  open?: boolean
}
export type ExpandableIconMenuRootEmits = {
  'update:open': [value: boolean]
}


export type ExpandableIconManuRootContext = {
  open: Ref<boolean>
  close: () => void
}

export const [injectExpandableMenuRootContext, provideExpandableMenuRootContext]
    = createContext<ExpandableIconManuRootContext>("ExpandableIconMenuRoot");
</script>

<script setup lang="ts">
import { onClickOutside, useVModel } from "@vueuse/core";
import { useTemplateRef } from "vue";

const props = withDefaults(defineProps<ExpandableIconMenuRootProps>(), {
  defaultOpen: false,
  open: undefined,
});
const emit = defineEmits<ExpandableIconMenuRootEmits>();

defineSlots<{
  default?: (props: {
    open: typeof open.value
    close: () => void
  }) => any
}>();

function close() {
  open.value = false;
}

const open = useVModel(props, 'open', emit, {
  defaultValue: props.defaultOpen,
  passive: (props.open === undefined) as false,
}) as Ref<boolean>;

const rootElement = useTemplateRef("root");

onClickOutside(rootElement, () => {
  open.value = false;
});

provideExpandableMenuRootContext({
  open,
  close,
});
</script>

<template>
  <div
      ref="root"
      role="menu"
      :data-state="open ? 'open' : 'closed'"
      class="group/expandable-icon-menu z-10 bg-background text-foreground border border-border rounded-md flex flex-col p-0.5"
  >
    <slot
        :open="open"
        :close="close"
    />
  </div>
</template>
