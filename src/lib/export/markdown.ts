import type { Guide } from "@/types/data.ts";
import { exportMarkdown } from "@/api/commands";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { htmlConverter } from "@/lib/html-conv";
import { MARKDOWN_ESCAPES, MARKDOWN_RULES } from "@/lib/html-conv/rules";


export async function exportGuideToMarkdown(templateId: string, guide: Guide): Promise<void> {
    const htmlToMarkdown = (html: string) => htmlConverter(html, {
        escapes: MARKDOWN_ESCAPES,
        rules: MARKDOWN_RULES,
    }).trim();

    const params = {
        title: htmlToMarkdown(guide.title),
        abstract: htmlToMarkdown(guide.abstract),
        nodes: structuredClone(guide.nodes).map(node => {
            if (node.type === "text") {
                node.text = htmlToMarkdown(node.text);
            }
            return node;
        }),
        footnote: htmlToMarkdown(guide.footnote),
    };

    const zipBlob = await exportMarkdown(templateId, guide.id, params);

    startBlobDownload(zipBlob, "guide.zip");
}
