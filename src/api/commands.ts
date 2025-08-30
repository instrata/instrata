import { invoke } from "@tauri-apps/api/core";


export async function captureScreen(guideId: string, screenIndex: number = 0): Promise<string> {
    return await invoke<string>("capture_screen", { guideId, screenIndex });
}


export async function renderTemplate(template: string, values: Record<string, unknown>): Promise<string> {
    return await invoke<string>("render_template", { template, values });
}


export async function exportPdf(templateId: string, params: Record<string, unknown>): Promise<Blob> {
    const pdf_bytes = await invoke<number[]>("export_pdf", { templateId, guideId: params.id, params });
    const buffer = new Uint8Array(pdf_bytes);
    return new Blob([buffer], { type: "application/pdf" });
}
