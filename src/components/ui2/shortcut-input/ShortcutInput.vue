<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideX } from "lucide-vue-next";
import { useVModel } from "@vueuse/core";
import { ref, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const internalValue = ref("");

watch(modelValue, (value) => {
  internalValue.value = value ?? "";
}, { immediate: true });

function formatShortcut(event: KeyboardEvent): string {
  const keys: string[] = [];
  if (event.ctrlKey) keys.push("Ctrl");
  if (event.metaKey) keys.push("Meta");
  if (event.shiftKey) keys.push("Shift");
  if (event.altKey) keys.push("Alt");
  if (event.key && !["Control", "Meta", "Alt", "Shift"].includes(event.key)) {
    keys.push(event.key.length === 1 ? event.key.toUpperCase() : event.key);
  }
  return keys.join("+");
}

function handleKeydown(event: KeyboardEvent) {
  if (["Tab", "Backspace", "Enter", "Escape"].includes(event.key)) return;

  const combo = formatShortcut(event);
  if (combo) {
    event.preventDefault();
    internalValue.value = combo;
  }
}

function handleBlur() {
  modelValue.value = internalValue.value;
}
</script>

<template>
  <div class="relative">
    <Input
        type="text"
        :value="internalValue"
        readonly
        placeholder="Press shortcut"
        @keydown="handleKeydown"
        @blur="handleBlur"
        class="pr-10"
        v-bind="$attrs"
    />
    <span class="absolute end-0 inset-y-0 flex items-center justify-center pr-0.5">
      <Button variant="ghost" size="icon" @click="modelValue = ''" class="size-8" title="Clear Shortcut">
        <LucideX />
      </Button>
    </span>
  </div>
</template>
