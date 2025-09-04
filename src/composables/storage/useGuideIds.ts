import { onBeforeUnmount, onMounted, ref } from "vue";
import { type UnwatchFn, watch as watchFs } from "@tauri-apps/plugin-fs";
import { getGuidesRoot, listGuidesIds } from "@/api/storage/guides.ts";
import { createSharedComposable } from "@vueuse/core";

export const useGuideIds = createSharedComposable(function () {
    const guideIds = ref<string[]>([]);
    async function refresh() {
        guideIds.value = await listGuidesIds();
    }
    let unwatchFn: UnwatchFn | null = null;

    onMounted(async () => {
        await refresh();
        unwatchFn?.();
        unwatchFn = await watchFs(await getGuidesRoot(), async () => {
            await refresh();
        });
    });

    onBeforeUnmount(() => {
        unwatchFn?.();
    });

    return {
        guideIds,
        refresh,
    };
});
