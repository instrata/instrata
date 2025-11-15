import { invoke } from "@tauri-apps/api/core";
import type { RuntimeInfo } from "@/types/commands.ts";
import type { TemplateContext } from "@/types/templates.ts";


/**
 * @param guideId guide into which the screenshot should be saved
 * @param screenIndex index of the screen
 */
export async function invokeCaptureScreen(guideId: string, screenIndex: number = 0): Promise<string> {
  return await invoke<string>("capture_screen", { guideId, screenIndex });
}

/**
 * @param templateId id of the template to use
 * @param guideId guide whose assets should be used
 * @param context additional context used when rendering the template
 */
export async function invokeExportMarkdown(templateId: string, guideId: string, context: TemplateContext): Promise<Blob> {
  const zip_bytes = await invoke<number[]>("export_markdown", { templateId, guideId, context });
  const buffer = new Uint8Array(zip_bytes);
  return new Blob([buffer], { type: "application/zip" });
}

/**
 * @param templateId id of the template to use
 * @param guideId guide whose assets should be used
 * @param context additional context used when rendering the template
 */
export async function invokeExportPdf(templateId: string, guideId: string, context: TemplateContext): Promise<Blob> {
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
 * @param externalPath absolute path to an external guide directory
 * @return guideId new internal identifier which links to the external guide
 */
export async function invokeLinkExternalGuide(externalPath: string): Promise<string> {
  return await invoke<string>("link_external_guide", { externalPath });
}

/**
 * @return get runtime information such as os, arch, or install-method
 */
export async function invokeGetRuntimeInfo(): Promise<RuntimeInfo> {
    return await invoke<RuntimeInfo>("get_runtime_info");
}
