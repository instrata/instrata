<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import ExportDialogCustomContent from "./ExportDialogCustomContent.vue";
import { Button } from "@/components/ui/button";
import { LucideFileDown, LucideX } from "lucide-vue-next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconMarkdown, IconPdfFile } from "@/components/icons";
import { useLocalStorage } from "@vueuse/core";
import ExportDialogInnerPdf from "@/components/app/export-dialog/ExportDialogInnerPdf.vue";
import ExportDialogInnerMarkdown from "@/components/app/export-dialog/ExportDialogInnerMarkdown.vue";

defineOptions({
  inheritAttrs: false,
});

const exportTab = useLocalStorage<"pdf" | "markdown">("app-export-tab", "pdf");
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="secondary" v-bind="$attrs">
        <LucideFileDown/>
        {{ $t('app.export-dialog.label') }}
      </Button>
    </DialogTrigger>
    <Tabs v-model="exportTab">
      <ExportDialogCustomContent>
        <template v-slot:above-content>
          <TabsList class="w-full mb-2">
            <TabsTrigger value="pdf">
              <IconPdfFile/>
              {{ $t('app.export-dialog.pdf.label') }}
            </TabsTrigger>
            <TabsTrigger value="markdown">
              <IconMarkdown/>
              {{ $t('app.export-dialog.markdown.label') }}
            </TabsTrigger>
            <DialogClose as-child>
              <Button variant="ghost">
                <LucideX />
              </Button>
            </DialogClose>
          </TabsList>
        </template>
        <TabsContent value="pdf" class="grid gap-4">
          <ExportDialogInnerPdf />
        </TabsContent>
        <TabsContent value="markdown" class="grid gap-4">
          <ExportDialogInnerMarkdown />
        </TabsContent>
      </ExportDialogCustomContent>
    </Tabs>
  </Dialog>
</template>
