<script setup lang="ts">
import type { SeparatorProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Separator } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<
    Omit<SeparatorProps, "orientation"> & { class?: HTMLAttributes["class"] }
>(), {
  decorative: true,
})

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <Separator
      data-slot="separator-root"
      orientation="vertical"
      v-bind="delegatedProps"
      :class="
      cn(
        `bg-border shrink-0 h-6 w-px`,
        props.class,
      )
    "
  />
</template>
