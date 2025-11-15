import { injectScreenshotOverlayContext } from "@/screenshot-overlay/context.ts";
import { computedAsync, createSharedComposable, onKeyStroke } from "@vueuse/core";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { useUnsubscribable } from "@/composables/useUnsubscribable.ts";
import { watch } from "vue";
import type { MonitorScreenshotData, RegionScreenshotData, WindowScreenshotData } from "@/types/ipc.ts";


type WithEmitterId = { emitterId: string }

type UseEventManagerReturn = {
  emitMonitorCapture: (data: MonitorScreenshotData) => Promise<void>
  emitWindowCapture: (data: WindowScreenshotData) => Promise<void>
  emitRegionCapture: (data: RegionScreenshotData) => Promise<void>
}

export const useEventManager = createSharedComposable<() => UseEventManagerReturn>(() => {
  const overlayWindow = getCurrentWindow();
  const mainWindow = computedAsync(() => Window.getByLabel("main"));

  const { visible, emitterId } = injectScreenshotOverlayContext();

  onKeyStroke("Escape", async () => {
    console.info(`[overlay] canceled via "Escape"`);
    visible.value = false;
  });

  watch(visible, async (isVisible) => {
    console.info(`[overlay] 'visible' turned to ${isVisible}`);
    if (isVisible) {
      await overlayWindow.show();
      await overlayWindow.setFocus();
    } else {
      await overlayWindow.hide();
    }
  });

  useUnsubscribable(() => overlayWindow.listen<WithEmitterId>(
      "instrata://screenshot-overlay-show",
      (event) => {
        console.info(`[overlay] shown by ${event.payload.emitterId}`);
        visible.value = true;
        emitterId.value = event.payload.emitterId;
      }
  ));
  useUnsubscribable(() => overlayWindow.listen<WithEmitterId>(
      "instrata://screenshot-overlay-hide",
      (event) => {
        console.info(`[overlay] hidden by ${event.payload.emitterId}`);
        visible.value = false;
      }
  ));

  async function emitMonitorCapture(data: MonitorScreenshotData) {
    visible.value = false;
    await mainWindow.value!.emit<MonitorScreenshotData & WithEmitterId>(
        "instrata://screenshot-monitor",
        { emitterId: emitterId.value, ...data }
    );
  }

  async function emitWindowCapture(data: WindowScreenshotData) {
    visible.value = false;
    await mainWindow.value!.emit<WindowScreenshotData & WithEmitterId>(
        "instrata://screenshot-window",
        { emitterId: emitterId.value, ...data }
    );
  }

  async function emitRegionCapture(data: RegionScreenshotData) {
    visible.value = false;
    await mainWindow.value!.emit<RegionScreenshotData & WithEmitterId>(
        "instrata://screenshot-region",
        { emitterId: emitterId.value, ...data }
    );
  }

  return {
    emitMonitorCapture,
    emitWindowCapture,
    emitRegionCapture,
  };
});
