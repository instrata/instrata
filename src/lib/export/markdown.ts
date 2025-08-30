import JSZip from "jszip";
import type { Guide } from "@/types/data.ts";
import { renderTemplate } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { readFile } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";


type MarkdownTemplateVariables = {
    title: string
    abstract: string
    steps: Array<{
        id: string
        pretext: string
        screenshotPath: string
        posttext: string
    }>
    footnote: string
}


export async function exportGuideToMarkdown(template: string, guide: Guide): Promise<void> {
    const zip = new JSZip();

    zip.folder("assets")
    for (const step of guide.steps) {
        const filePath = await join(await appDataDir(), guide.id, `${step.screenshotId}.png`);
        const fileContent = await readFile(filePath);

        zip.file(`assets/${step.screenshotId}.png`, fileContent, { binary: true });
    }

    const templateVariables: MarkdownTemplateVariables = {
        title: guide.title,
        abstract: guide.abstract,
        steps: guide.steps.map(step => ({
            id: step.id,
            pretext: step.pretext,
            screenshotPath: `assets/${step.id}.png`,
            posttext: step.posttext,
        })),
        footnote: guide.footnote,
    }

    const rendered = await renderTemplate(template, templateVariables);

    zip.file("README.md", rendered);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    startBlobDownload(zipBlob, "guide.zip");
}
