import { Window } from "@tauri-apps/api/window";
import { sleep } from "@/lib/utils.ts";


export async function waitWindowInvisible(window: Window, timeout?: number): Promise<void> {
  const start = Date.now();

  while (await window.isVisible()) {
    await sleep(10);
    if (timeout && Date.now() > (start + timeout)) {
      throw new Error(`reached timeout of ${timeout}ms while waiting for window '${window.label}' to be invisible`);
    }
  }
}
