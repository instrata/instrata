import { register, type ShortcutHandler, unregister } from "@tauri-apps/plugin-global-shortcut";
import { toValue, watch, type MaybeRefOrGetter } from "vue";

export function useGlobalShortcut(shortcut: MaybeRefOrGetter<string>, handler: ShortcutHandler) {
  watch(() => toValue(shortcut), async (shortcut, _, onCleanup) => {
    if (!shortcut) return;

    await register(shortcut, handler);

    onCleanup(async () => {
      await unregister(shortcut);
    });
  }, { immediate: true });
}
