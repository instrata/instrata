import type { Guide } from "@/types/storage.ts";
import { exportPdf } from "@/api/commands";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { htmlConverter } from "@/lib/html-conv";
import { TYPST_ESCAPES, TYPST_RULES } from "@/lib/html-conv/rules";
import type { TemplateContext } from "@/types/templates.ts";

export async function exportGuideToPdf(templateId: string, guide: Guide): Promise<void>  {
    const htmlToTypst = (html: string) => htmlConverter(html, {
        escapes: TYPST_ESCAPES,
        rules: TYPST_RULES,
    }).trim();

    const context: TemplateContext = {
        title: htmlToTypst(guide.title),
        abstract: htmlToTypst(guide.abstract),
        nodes: structuredClone(guide.nodes).map(node => {
            switch (node.type) {
              case "text":
                return {
                  id: node.id,
                  type: "text",
                  text: htmlToTypst(node.text),
                };
              case "image":
                return {
                  id: node.id,
                  type: "image",
                  path: `images/${node.imageId}.png`,
                }
            }
        }),
        footnote: htmlToTypst(guide.footnote),
    }

    const pdfBlob = await exportPdf(templateId, guide.id, context);

    await startBlobDownload(pdfBlob, "guide.pdf");
}
