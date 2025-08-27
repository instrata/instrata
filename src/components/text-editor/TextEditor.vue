<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { ref, watch } from "vue";
import {
  LucideBold, LucideBraces, LucideCode,
  LucideItalic, LucideLink,
  LucideList,
  LucideListOrdered, LucidePilcrow,
  LucideQuote,
  LucideRedo, LucideRemoveFormatting,
  LucideUndo
} from "lucide-vue-next";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import InvisibleCharacters from "@tiptap/extension-invisible-characters";
import { Placeholder } from "@tiptap/extensions";

declare module "@tiptap/core" {
  // @tiptap/extension-invisible-characters is somehow not typed for the storage
  interface Storage {
    invisibleCharacters: {
      visibility: () => boolean
    },
  }
}

const props = defineProps<{
  placeholder?: string
}>();
const modelValue = defineModel<string>({ required: true });

watch(modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value;
  if (isSame) return;

  console.log("watch");
  editor.value?.commands.setContent(value, { emitUpdate: false, parseOptions: { preserveWhitespace: true } });
});

const hasFocus = ref<boolean>(false);

const editor = useEditor({
  content: modelValue.value,
  extensions: [
    StarterKit.configure({
      strike: false,
      underline: false,
      link: {
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        protocols: ["http", "https", "mailto", { scheme: 'tel', optionalSlashes: true }],
      }
    }),
    InvisibleCharacters.configure({
      visible: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  onUpdate: ({ editor }) => {
    modelValue.value = editor.getHTML();
  },
  onFocus: () => {
    hasFocus.value = true;
  },
  onBlur: () => {
    hasFocus.value = false;
  },
});
</script>

<template>
  <Popover :open="hasFocus">
    <PopoverAnchor as-child>
      <EditorContent :editor="editor" class="text-editor" />
    </PopoverAnchor>
    <PopoverContent
        side="top" align="start"
        :side-offset="6"
        class="flex gap-0.25 rounded-lg h-10 w-auto px-0.25 py-0 [&>button]:my-0.25"
        @open-auto-focus.prevent
        @mousedown.prevent
    >
      <Toggle
          :model-value="editor?.isActive('bold')"
          @click="editor?.chain().focus().toggleBold().run()"
      >
        <LucideBold />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('italic')"
          @click="editor?.chain().focus().toggleItalic().run()"
      >
        <LucideItalic />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('link')"
          @click="editor?.chain().focus().toggleLink().run()"
      >
        <LucideLink />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('code')"
          @click="editor?.chain().focus().toggleCode().run()"
      >
        <LucideCode />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle
          :model-value="editor?.isActive('codeblock')"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
      >
        <LucideBraces />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('blockquote')"
          @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        <LucideQuote />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('bulletList')"
          @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <LucideList />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('orderedList')"
          @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <LucideListOrdered />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          :disabled="!editor?.can().undo()"
          @mousedown.prevent
          @click="editor?.chain().focus().undo().run()"
      >
        <LucideUndo />
      </Toggle>
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          :disabled="!editor?.can().redo()"
          @mousedown.prevent
          @click="editor?.chain().focus().redo().run()"
      >
        <LucideRedo />
      </Toggle>
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          @mousedown.prevent
          @click="editor?.chain().focus().unsetAllMarks().run()"
      >
        <LucideRemoveFormatting />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle
          :model-value="editor?.storage.invisibleCharacters.visibility()"
          @click="editor?.chain().focus().toggleInvisibleCharacters().run()"
      >
        <LucidePilcrow />
      </Toggle>
    </PopoverContent>
  </Popover>
</template>
