import { onBeforeUnmount, onMounted, ref } from "vue";
import { exists, type UnwatchFn, watch as watchFs } from "@tauri-apps/plugin-fs";
import { getGuidesRoot, listGuidesIds } from "@/api/storage/guides.ts";
import { createSharedComposable, useEventListener } from "@vueuse/core";

export const useGuideIds = createSharedComposable(function () {
    const guideIds = ref<string[]>([]);
    async function refresh() {
        guideIds.value = await listGuidesIds();
    }
    let unwatchFn: UnwatchFn | null = null;

    onMounted(async () => {
        await refresh();
        unwatchFn?.();
        const guideRoot = await getGuidesRoot();
        if (await exists(guideRoot)) {
            unwatchFn = await watchFs(guideRoot, async () => {
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
        guideIds,
        refresh,
    };
});
