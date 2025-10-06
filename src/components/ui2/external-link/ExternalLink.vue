<script setup lang="ts">
import type { AnchorHTMLAttributes } from "vue";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

defineOptions({
  inheritAttrs: false,
})

defineProps</* @vue-ignore */ AnchorHTMLAttributes>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Leaving the application
        </DialogTitle>
        <DialogDescription>
          This link will open in your default browser: <br>
        </DialogDescription>
      </DialogHeader>
      <div class="text-sm break-all">
        {{ $attrs.href }}
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary">
            Stay here
          </Button>
        </DialogClose>
        <a target="_blank" rel="noopener noreferrer" v-bind="$attrs">
          <Button>
            Open link
          </Button>
        </a>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
