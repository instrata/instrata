import JSZip from "jszip";
import type { Guide } from "@/types/data.ts";
import { renderTemplate } from "@/api/commands.ts";
import { startBlobDownload } from "@/lib/export/utils.ts";


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
        const dataUrl = step.screenshot;

        const extension = /^data:\w+\/(\w+);/.exec(dataUrl)?.[1];
        const imageContent = dataUrl.replace(/^data:\w+\/\w+;base64,/, "");

        zip.file(`assets/${step.id}.${extension}`, imageContent, { base64: true });
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
