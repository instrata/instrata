import { register, type ShortcutHandler, unregister } from "@tauri-apps/plugin-global-shortcut";
import { toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "@vueuse/core";

export async function useGlobalShortcut(shortcut: MaybeRefOrGetter<string>, handler: ShortcutHandler) {
    watch(() => toValue(shortcut), async (shortcut, _, onCleanup) => {
        if (!shortcut) return;

        await register(shortcut, handler);

        onCleanup(async () => {
            await unregister(shortcut);
        });
    }, { immediate: true });
}
