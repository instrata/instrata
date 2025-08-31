import JSZip from "jszip";
import type { Guide } from "@/types/data.ts";
import { renderTemplate } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { readFile } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";


export async function exportGuideToMarkdown(template: string, guide: Guide): Promise<void> {
    const zip = new JSZip();

    zip.folder("screenshots")
    for (const node of guide.nodes) {
        if (node.type !== 'image') continue;

        const filePath = await join(await appDataDir(), guide.id, `${node.screenshotId}.png`);
        const fileContent = await readFile(filePath);

        zip.file(`screenshots/${node.screenshotId}.png`, fileContent, { binary: true });
    }

    const rendered = await renderTemplate(template, guide);

    zip.file("README.md", rendered);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    startBlobDownload(zipBlob, "guide.zip");
}
