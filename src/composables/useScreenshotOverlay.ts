import { computedAsync } from "@vueuse/core";
import { Window } from "@tauri-apps/api/window";
import { useUnsubscribable } from "@/composables/useUnsubscribable.ts";
import { nanoid } from "nanoid";
import type { MonitorScreenshotData, WindowScreenshotData, RegionScreenshotData } from "@/types/ipc.ts";
import { waitWindowInvisible } from "@/lib/tauri-utils.ts";

type WithEmitterId = { emitterId: string }

type UseScreenshotOverlayOptions = {
  onMonitorScreenshot?: (data: MonitorScreenshotData) => void
  onWindowScreenshot?: (data: WindowScreenshotData) => void
  onRegionScreenshot?: (data: RegionScreenshotData) => void
}
type UseScreenshotOverlayReturn = {
  show: () => Promise<void>
  hide: () => Promise<void>
}


export function useScreenshotOverlay(options: UseScreenshotOverlayOptions): UseScreenshotOverlayReturn {
  const emitterId = nanoid();

  const window = computedAsync(() => Window.getByLabel("screenshot-overlay"));

  async function show(): Promise<void> {
    await window.value!.emit<WithEmitterId>("instrata://screenshot-overlay-show", { emitterId });
  }

  async function hide(): Promise<void> {
    await window.value!.emit<WithEmitterId>("instrata://screenshot-overlay-hide", { emitterId });
  }

  useUnsubscribable(() => window.value?.listen<MonitorScreenshotData & WithEmitterId>(
      "instrata://screenshot-monitor",
      async (event) => {
        if (event.payload.emitterId === emitterId) {
          await waitWindowInvisible(window.value!, 1000);
          options.onMonitorScreenshot?.(event.payload);
        }
      },
  ));
  useUnsubscribable(() => window.value?.listen<WindowScreenshotData & WithEmitterId>(
      "instrata://screenshot-window",
      async (event) => {
        if (event.payload.emitterId === emitterId) {
          await waitWindowInvisible(window.value!, 1000);
          options.onWindowScreenshot?.(event.payload);
        }
      },
  ));
  useUnsubscribable(() => window.value?.listen<RegionScreenshotData & WithEmitterId>(
      "instrata://screenshot-region",
      async (event) => {
        if (event.payload.emitterId === emitterId) {
          await waitWindowInvisible(window.value!, 1000);
          options.onRegionScreenshot?.(event.payload);
        }
      },
  ));

  return {
    show,
    hide,
  };
}
