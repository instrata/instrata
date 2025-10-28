import type { Guide } from "@/types/storage.ts";
import { exportMarkdown } from "@/api/commands";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { htmlConverter } from "@/lib/html-conv";
import { MARKDOWN_ESCAPES, MARKDOWN_RULES } from "@/lib/html-conv/rules";
import type { TemplateContext } from "@/types/templates.ts";


export async function exportGuideToMarkdown(templateId: string, guide: Guide): Promise<void> {
    const htmlToMarkdown = (html: string) => htmlConverter(html, {
        escapes: MARKDOWN_ESCAPES,
        rules: MARKDOWN_RULES,
    }).trim();

    const context: TemplateContext = {
        title: htmlToMarkdown(guide.title),
        abstract: htmlToMarkdown(guide.abstract),
        nodes: structuredClone(guide.nodes).map(node => {
            switch (node.type) {
              case "text":
                return {
                  id: node.id,
                  type: "text",
                  text: htmlToMarkdown(node.text),
                };
              case "image":
                return {
                  id: node.id,
                  type: "image",
                  path: `images/${node.imageId}.png`,
                };
            }
        }),
        footnote: htmlToMarkdown(guide.footnote),
    };

    const zipBlob = await exportMarkdown(templateId, guide.id, context);

    await startBlobDownload(zipBlob, "guide.zip");
}
