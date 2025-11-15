import { createContext } from "reka-ui";
import type { Ref } from "vue";

export type ScreenshotOverlayMode =
  // | "monitor"
  | "window"
  | "region"

export type ScreenshotOverlayContext = {
  visible: Ref<boolean>
  emitterId: Ref<string>
  mode: Ref<ScreenshotOverlayMode>
}


export const [injectScreenshotOverlayContext, provideScreenshotOverlayContext]
    = createContext<ScreenshotOverlayContext>("screenshot-overlay");
