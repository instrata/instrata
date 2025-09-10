import { downloadDir, join } from "@tauri-apps/api/path";
import { toast } from "vue-sonner";
import { exists, writeFile } from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";


async function findFreeFilename(filename: string): Promise<string> {
    const rootDir = await downloadDir();

    let downloadPath = await join(rootDir, filename);
    if (!await exists(downloadPath)) return downloadPath;

    const splitIndex = filename.lastIndexOf(".");
    const [basename, suffix] = splitIndex > 0
        ? [filename.substring(0, splitIndex), filename.substring(splitIndex)]
        : [filename, ""];
    let i = 1;

    while (await exists(downloadPath = await join(rootDir, `${basename}(${i})${suffix}`))) {
        i++;
    }

    return downloadPath;
}

export async function startBlobDownload(blob: Blob, filename: string): Promise<void> {
    const downloadPath = await findFreeFilename(filename);

    await writeFile(downloadPath, blob.stream(), { createNew: true });

    toast.success("File saved successfully.", {
        description: downloadPath,
        action: {
            label: "Show",
            onClick: async () => {
                await revealItemInDir(downloadPath);
            },
        },
    });
}

export async function startTextDownload(content: string, filename: string): Promise<void> {
    const blob = new Blob([content], { type: "text/plain" })
    return await startBlobDownload(blob, filename);
}
