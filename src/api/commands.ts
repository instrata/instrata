import { invoke } from "@tauri-apps/api/core";


export async function captureScreen(screenIndex: number = 0): Promise<string> {
    return await invoke<string>("capture_screen", { index: screenIndex });
}


export async function renderTemplate(template: string, values: Record<string, unknown>): Promise<string> {
    return await invoke<string>("render_template", { template, values });
}
