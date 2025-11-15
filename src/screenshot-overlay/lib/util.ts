import { getCurrentWindow } from "@tauri-apps/api/window";

export async function forceRepaint() {
  const win = getCurrentWindow();
  await win.setSize(await win.innerSize());
}
