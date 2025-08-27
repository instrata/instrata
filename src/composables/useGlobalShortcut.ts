import { register, type ShortcutHandler, unregister } from "@tauri-apps/plugin-global-shortcut";
import { onBeforeUnmount, onMounted } from "vue";

export async function useGlobalShortcut(shortcut: string, handler: ShortcutHandler) {
    onMounted(async() => {
        await register(shortcut, handler);
    });
    onBeforeUnmount(async() => {
        await unregister(shortcut);
    });
}
