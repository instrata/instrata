import type { Guide, GuideInfo } from "@/types/data.ts";
import { appDataDir, join } from "@tauri-apps/api/path";
import {copyFile, exists, mkdir, readDir, readTextFile, remove, stat, writeTextFile} from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";


export async function getGuidesRoot(): Promise<string> {
    const dir = await join(await appDataDir(), "guides");
    if (!await exists(dir)) await mkdir(dir, { recursive: true });
    return dir;
}

export async function listGuidesIds(): Promise<string[]> {
    const rootDir = await getGuidesRoot();
    return (await readDir(rootDir))
        .filter(e => e.isDirectory)
        .map(e => e.name);
}

export async function existsGuide(guideId: string): Promise<boolean> {
    const rootDir = await getGuidesRoot();
    const guideDir = await join(rootDir, guideId);
    return await exists(guideDir);
}

export async function createNewGuide(): Promise<Guide> {
    const guide: Guide = {
        id: nanoid(),
        title: "",
        abstract: "",
        nodes: [],
        footnote: "",
    };
    const rootDir = await getGuidesRoot();
    const guideDir = await join(rootDir, guide.id);
    await mkdir(guideDir, { recursive: true });
    const jsonString = JSON.stringify(guide, null, 2);
    await writeTextFile(await join(guideDir, "data.json"), jsonString, { createNew: true });
    await mkdir(await join(guideDir, "screenshots"));
    return guide;
}

export async function cloneGuide(source: Guide): Promise<Guide> {
    const guide: Guide = {
        ...source,
        id: nanoid(),
    };

    const rootDir = await getGuidesRoot();
    const sourceDir = await join(rootDir, source.id);
    const guideDir = await join(rootDir, guide.id);

    await mkdir(guideDir, { recursive: true });
    await cloneDirectory(sourceDir, guideDir);

    const jsonString = JSON.stringify(guide, null, 2);
    await writeTextFile(await join(guideDir, "data.json"), jsonString);

    await mkdir(await join(guideDir, "screenshots"), { recursive: true });

    return guide;
}

async function cloneDirectory(src: string, dest: string): Promise<void> {
    for (const entry of await readDir(src)) {
        if (entry.isFile) {
            const srcFile = await join(src, entry.name);
            const destFile = await join(dest, entry.name);
            await copyFile(srcFile, destFile);
        } else if (entry.isDirectory) {
            const srcDir = await join(src, entry.name);
            const mode = (await stat(srcDir)).mode ?? undefined;
            const destDir = await join(dest, entry.name);
            await mkdir(destDir, { mode });
            await cloneDirectory(srcDir, destDir);
        } else {
            console.error(`unable to clone '${entry.name}' from '${src}' as its type is unsupported`);
        }
    }
}

export async function loadGuide(guideId: string): Promise<Guide> {
    const rootDir = await getGuidesRoot();
    const guideDataFile = await join(rootDir, guideId, "data.json");
    const jsonString = await readTextFile(guideDataFile);
    return JSON.parse(jsonString);
}

export async function loadGuideInfo(guideId: string): Promise<GuideInfo> {
    const rootDir = await getGuidesRoot();
    const guideDataFile = await join(rootDir, guideId, "data.json");
    const fileInfo = await stat(guideDataFile);
    return {
        mtime: fileInfo.mtime,
        birthTime: fileInfo.birthtime,
    };
}

export async function saveGuide(guide: Guide): Promise<void> {
    const rootDir = await getGuidesRoot();
    const guideDataFile = await join(rootDir, guide.id, "data.json");
    const jsonString = JSON.stringify(guide, null, 2);
    await writeTextFile(guideDataFile, jsonString);
}

export async function deleteGuide(guideId: string): Promise<void> {
    const rootDir = await getGuidesRoot();
    const guideDir = await join(rootDir, guideId);
    await remove(guideDir, { recursive: true });
}
