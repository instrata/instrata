import { invoke } from "@tauri-apps/api/core";
import type { RuntimeInfo, WindowInfo } from "@/types/commands.ts";
import type { TemplateContext } from "@/types/templates.ts";
import type { BBox, ImageId } from "@/types/common.ts";



export async function invokeCaptureRegion(guideId: string, region: BBox): Promise<ImageId> {
  return await invoke<ImageId>("capture_region", { guideId, region });
}


export async function invokeCaptureMonitor(guideId: string, monitorName: string): Promise<ImageId> {
  return await invoke<ImageId>("capture_monitor", { guideId, monitorName });
}


export async function invokeCaptureWindow(guideId: string, windowId: number): Promise<ImageId> {
  return await invoke<ImageId>("capture_window", { guideId, windowId });
}


export async function exportMarkdown(templateId: string, guideId: string, context: TemplateContext): Promise<Blob> {
    const zip_bytes = await invoke<number[]>("export_markdown", { templateId, guideId, context });
    const buffer = new Uint8Array(zip_bytes);
    return new Blob([buffer], { type: "application/zip" });
}


export async function exportPdf(templateId: string, guideId: string, context: TemplateContext): Promise<Blob> {
    const pdf_bytes = await invoke<number[]>("export_pdf", { templateId, guideId, context });
    const buffer = new Uint8Array(pdf_bytes);
    return new Blob([buffer], { type: "application/pdf" });
}

/**
 * @param guideId id of the guide to export
 * @return Blob of the archive
 */
export async function invokeExportGuide(guideId: string): Promise<Blob> {
  const zipBytes = await invoke<number[]>("export_guide", { guideId });
  const buffer = new Uint8Array(zipBytes);
  return new Blob([buffer], { type: "application/instrata" });
}

/**
 * @param archivePath absolute file path to the archive to import
 * @return guideId of the newly imported guide
 */
export async function invokeImportGuide(archivePath: string): Promise<string> {
  return await invoke<string>("import_guide", {archivePath});
}

/**
 * todo: implement
 * @param externalPath absolute path to an external guide directory
 * @return guideId new internal identifier which links to the external guide
 */
export async function invokeLinkExternalGuide(externalPath: string): Promise<string> {
  return await invoke<string>("link_external_guide", { externalPath });
}


/**
 * @return information about all windows available
 */
export async function invokeListWindows(): Promise<WindowInfo[]> {
  return await invoke<WindowInfo[]>("list_windows");
}

export async function getRuntimeInfo(): Promise<RuntimeInfo> {
    return await invoke<RuntimeInfo>("get_runtime_info");
}
