import type { Guide } from "@/types/data.ts";
import { exportPdf } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";
import { htmlConverter } from "@/lib/html-conv";
import { TYPST_ESCAPES, TYPST_RULES } from "@/lib/html-conv/rules";

export async function exportGuideToPdf(templateId: string, guide: Guide): Promise<void>  {

    const htmlToTypst = (html: string) => htmlConverter(html, {
        escapes: TYPST_ESCAPES,
        rules: TYPST_RULES,
    });

    const templateParameters = {
        title: htmlToTypst(guide.title),
        abstract: htmlToTypst(guide.abstract),
        nodes: structuredClone(guide.nodes).map(node => {
            if (node.type === "text") {
                node.text = htmlToTypst(node.text);
            }
            return node;
        }),
        footnote: htmlToTypst(guide.footnote),
    }

    const pdfBlob = await exportPdf(templateId, guide.id, templateParameters);

    startBlobDownload(pdfBlob, "guide.pdf");
}
