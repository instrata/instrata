import { invoke } from "@tauri-apps/api/core";
import type { RuntimeInfo } from "@/types/commands.ts";
import type { TemplateContext } from "@/types/templates.ts";


export async function captureScreen(guideId: string, screenIndex: number = 0): Promise<string> {
    return await invoke<string>("capture_screen", { guideId, screenIndex });
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

export async function getRuntimeInfo(): Promise<RuntimeInfo> {
    return await invoke<RuntimeInfo>("get_runtime_info");
}
