import type { BBox } from "@/types/common.ts";

export type MonitorScreenshotData = {
  monitorName: string
}
export type WindowScreenshotData = {
  windowId: number
}
export type RegionScreenshotData = {
  region: BBox
}
