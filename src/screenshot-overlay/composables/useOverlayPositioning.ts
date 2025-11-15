import {
  availableMonitors,
  getCurrentWindow,
  LogicalPosition, LogicalSize,
} from "@tauri-apps/api/window";
import { onMounted } from "vue";
import type { BBox } from "@/types/common.ts";
import { whenever } from "@vueuse/core";
import { injectScreenshotOverlayContext } from "@/screenshot-overlay/context.ts";


export function useOverlayPositioning() {
  const { visible } = injectScreenshotOverlayContext();

  async function updatePositionAndLayout() {
    const monitors = await availableMonitors();

    const bbox: BBox = {
      x: Math.min(...monitors.map(m => m.position.x)),
      y: Math.min(...monitors.map(m => m.position.y)),
      width: Math.max(...monitors.map(m => m.position.x + m.size.width)),
      height: Math.max(...monitors.map(m => m.position.y + m.size.height)),
    };
    console.info(`[screenshot-overlay] updating layout to ${JSON.stringify(bbox)}`);

    const window = getCurrentWindow();
    await Promise.all([
      window.setPosition(new LogicalPosition(bbox.x, bbox.y)),
      window.setSize(new LogicalSize(bbox.width, bbox.height)),
    ]);
    console.info("[screenshot-overlay] layout update completed");
  }

  whenever(visible, updatePositionAndLayout);

  onMounted(updatePositionAndLayout);
}
