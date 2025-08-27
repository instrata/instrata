import { invoke } from "@tauri-apps/api/core";


export async function captureScreen(screenIndex: number = 0): Promise<string> {
    return await invoke<string>("capture_screen", { index: screenIndex });
}
