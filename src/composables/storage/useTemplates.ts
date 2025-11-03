import { createSharedComposable, useEventListener } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { exists, type UnwatchFn, watch as watchFs } from "@tauri-apps/plugin-fs";
import { findTemplates, getCustomTemplatesLocation } from "@/api/storage/templates.ts";
import type { TemplateMetadata } from "@/types/templates.ts";

export const useTemplates = createSharedComposable(function () {
  // todo: include built-in sorting
  const templates = ref<TemplateMetadata[]>([]);
  async function refresh() {
    templates.value = await findTemplates();
  }
  let unwatchFn: UnwatchFn | null = null;

  onMounted(async () => {
    await refresh();
    unwatchFn?.();
    const customTemplateLocation = await getCustomTemplatesLocation();
    if (await exists(customTemplateLocation)) {
      unwatchFn = await watchFs(customTemplateLocation, async () => {
        await refresh();
      });
    }
  });

  onBeforeUnmount(() => {
    unwatchFn?.();
  });

  useEventListener("focus", async () => {
    await refresh();
  });

  return {
    templates,
    refresh,
  };
});
