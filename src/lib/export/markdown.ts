import JSZip from "jszip";
import type { Guide } from "@/types/data.ts";
import { renderTemplate } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { readFile } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import { htmlConverter } from "@/lib/html-conv";
import { MARKDOWN_ESCAPES, MARKDOWN_RULES } from "@/lib/html-conv/rules";


export async function exportGuideToMarkdown(templateId: string, guide: Guide): Promise<void> {
    const zip = new JSZip();

    zip.folder("screenshots")
    for (const node of guide.nodes) {
        if (node.type !== 'image') continue;

        const filePath = await join(await appDataDir(), guide.id, `${node.screenshotId}.png`);
        const fileContent = await readFile(filePath);

        zip.file(`screenshots/${node.screenshotId}.png`, fileContent, { binary: true });
    }

    const htmlToMarkdown = (html: string) => htmlConverter(html, {
        escapes: MARKDOWN_ESCAPES,
        rules: MARKDOWN_RULES,
    });

    const rendered = await renderTemplate(templateId, {
        title: htmlToMarkdown(guide.title),
        abstract: htmlToMarkdown(guide.abstract),
        nodes: structuredClone(guide.nodes).map(node => {
            if (node.type === "text") {
                node.text = htmlToMarkdown(node.text);
            }
            return node;
        }),
        footnote: htmlToMarkdown(guide.footnote),
    });

    zip.file("README.md", rendered);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    startBlobDownload(zipBlob, "guide.zip");
}
