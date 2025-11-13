<script setup lang="ts">
import type { AnchorHTMLAttributes } from "vue";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@vueuse/core";
import { LucideCopy, LucideCopyCheck, LucideGlobe, LucideX } from "lucide-vue-next";

defineOptions({
  inheritAttrs: false,
})

defineProps</* @vue-ignore */ AnchorHTMLAttributes>();

const { copy, copied: recentlyCopied, isSupported: copySupported } = useClipboard();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ $t('components.external-link.title') }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('components.external-link.description') }}
        </DialogDescription>
      </DialogHeader>
      <div class="text-sm font-mono select-all break-all">
        {{ $attrs.href }}
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary">
            <LucideX />
            {{ $t('components.external-link.actions.stay') }}
          </Button>
        </DialogClose>
        <Button v-if="copySupported" variant="secondary" @click="copy($attrs.href as string)">
          <LucideCopyCheck v-if="recentlyCopied" />
          <LucideCopy v-else />
          {{ $t('components.external-link.actions.copy') }}
        </Button>
        <a target="_blank" rel="noopener noreferrer" v-bind="$attrs">
          <Button variant="default">
            <LucideGlobe />
            {{ $t('components.external-link.actions.open') }}
          </Button>
        </a>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
