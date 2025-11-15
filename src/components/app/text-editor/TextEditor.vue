<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { type HTMLAttributes, ref, watch } from "vue";
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
import { TipTapSingleLineExtension } from "@/lib/tiptap";

declare module "@tiptap/core" {
  // @tiptap/extension-invisible-characters is somehow not typed for the storage
  interface Storage {
    invisibleCharacters: {
      visibility: () => boolean
    },
  }
}

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'],
  placeholder?: string
  multiline?: boolean
  //
  codeBlock?: boolean
  blockquote?: boolean
  orderedList?: boolean
  bulletList?: boolean
}>(), {
  multiline: true,
  //
  codeBlock: true,
  blockquote: true,
  orderedList: true,
  bulletList: true,
});
const modelValue = defineModel<string>({ required: true });

watch(modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value;
  if (isSame) return;

  editor.value?.commands.setContent(value, { emitUpdate: false, parseOptions: { preserveWhitespace: true } });
});

const hasFocus = ref<boolean>(false);

const editor = useEditor({
  content: modelValue.value,
  onBeforeCreate(opts) {
    if (!props.multiline) {
      opts.editor.extensionManager.extensions.push(
          TipTapSingleLineExtension.configure({}),
      );
    }
  },
  extensions: [
    StarterKit.configure({
      codeBlock: props.codeBlock && undefined,
      blockquote: props.blockquote && undefined,
      orderedList: props.orderedList && undefined,
      bulletList: props.bulletList && undefined,
      //
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
      placeholder: () => props.placeholder ?? "",
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
      <EditorContent :editor="editor" class="text-editor" :class="props.class" />
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
          :title="$t('app.text-editor.toggle-bold')"
      >
        <LucideBold />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('italic')"
          @click="editor?.chain().focus().toggleItalic().run()"
          :title="$t('app.text-editor.toggle-italic')"
      >
        <LucideItalic />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('link')"
          @click="editor?.chain().focus().toggleLink().run()"
          :title="$t('app.text-editor.toggle-hyperref')"
      >
        <LucideLink />
      </Toggle>
      <Toggle
          :model-value="editor?.isActive('code')"
          @click="editor?.chain().focus().toggleCode().run()"
          :title="$t('app.text-editor.toggle-code')"
      >
        <LucideCode />
      </Toggle>
      <Separator v-if="codeBlock || blockquote || bulletList || orderedList" orientation="vertical" />
      <Toggle
          v-if="codeBlock"
          :model-value="editor?.isActive('codeBlock')"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          :title="$t('app.text-editor.toggle-code-block')"
      >
        <LucideBraces />
      </Toggle>
      <Toggle
          v-if="blockquote"
          :model-value="editor?.isActive('blockQuote')"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :title="$t('app.text-editor.toggle-blockquote')"
      >
        <LucideQuote />
      </Toggle>
      <Toggle
          v-if="bulletList"
          :model-value="editor?.isActive('bulletList')"
          @click="editor?.chain().focus().toggleBulletList().run()"
          :title="$t('app.text-editor.toggle-unordered-list')"
      >
        <LucideList />
      </Toggle>
      <Toggle
          v-if="orderedList"
          :model-value="editor?.isActive('orderedList')"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :title="$t('app.text-editor.toggle-ordered-list')"
      >
        <LucideListOrdered />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          :disabled="!editor?.can().undo()"
          @mousedown.prevent
          @click="editor?.chain().focus().undo().run()"
          :title="$t('app.text-editor.undo')"
      >
        <LucideUndo />
      </Toggle>
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          :disabled="!editor?.can().redo()"
          @mousedown.prevent
          @click="editor?.chain().focus().redo().run()"
          :title="$t('app.text-editor.redo')"
      >
        <LucideRedo />
      </Toggle>
      <Toggle
          :aria-pressed="false" :data-state="false" role="button"
          @mousedown.prevent
          @click="editor?.chain().focus().unsetAllMarks().run()"
          :title="$t('app.text-editor.clear-formatting')"
      >
        <LucideRemoveFormatting />
      </Toggle>
      <Separator orientation="vertical" />
      <Toggle
          :model-value="editor?.storage.invisibleCharacters.visibility()"
          @click="editor?.chain().focus().toggleInvisibleCharacters().run()"
          :title="$t('app.text-editor.toggle-formatting-marks')"
      >
        <LucidePilcrow />
      </Toggle>
    </PopoverContent>
  </Popover>
</template>
