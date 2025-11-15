import { computedAsync, createSharedComposable } from "@vueuse/core";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { useUnsubscribable } from "@/composables/useUnsubscribable.ts";

export const useAutoDestroy = createSharedComposable(() => {
  const mainWindow = computedAsync(() => Window.getByLabel("main"));

  useUnsubscribable(() => mainWindow.value?.listen("tauri://destroyed", async () => {
    try {
      const window = getCurrentWindow();
      await window.destroy();
    } catch (error) {
      console.error(error);
    }
  }));
});
