import { useScreenshotOverlay } from "@/composables/useScreenshotOverlay.ts";
import type { ImageNode } from "@/types/storage.ts";
import { nanoid } from "nanoid";
import { injectAppContext } from "@/components/app/app-context.ts";
import { invokeCaptureMonitor, invokeCaptureRegion, invokeCaptureWindow } from "@/api/commands";
import { sleep } from "@/lib/utils.ts";

type UseScreenshotManagerOptions = {
  beforeNodeId?: string
}
type UseScreenshotManagerReturn = {
  show: () => Promise<void>
}

export function useScreenshotManager(options: UseScreenshotManagerOptions): UseScreenshotManagerReturn {
  const {
      beforeNodeId
  } = options;

  const { guide } = injectAppContext();

  function createImageNode(imageId: string): ImageNode {
    return {
      id: nanoid(),
      type: "image",
      imageId: imageId,
    };
  }

  function insertNode(node: ImageNode): void {
    const index = beforeNodeId
        ? guide.value.nodes.findIndex(n => n.id === beforeNodeId)
        : guide.value.nodes.length;
    guide.value.nodes.splice(index, 0, node);
  }

  const { show } = useScreenshotOverlay({
    onMonitorScreenshot: async ({ monitorName }) => {
      await sleep(200);  // required as it takes a while for the overlay-window to hide
      const screenshotId = await invokeCaptureMonitor(guide.value.id, monitorName);
      insertNode(createImageNode(screenshotId));
    },
    onWindowScreenshot: async ({ windowId }) => {
      const screenshotId = await invokeCaptureWindow(guide.value.id, windowId);
      insertNode(createImageNode(screenshotId));
    },
    onRegionScreenshot: async ({ region }) => {
      await sleep(200);  // required as it takes a while for the overlay-window to hide
      const screenshotId = await invokeCaptureRegion(guide.value.id, region);
      insertNode(createImageNode(screenshotId));
    },
  });

  return {
    show,
  };
}
