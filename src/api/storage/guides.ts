import type { Guide } from "@/types/data.ts";
import { appDataDir, join } from "@tauri-apps/api/path";
import { exists, mkdir, readDir, readTextFile, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";


export async function getGuidesRoot(): Promise<string> {
    return await join(await appDataDir(), "guides");
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

export async function loadGuide(guideId: string): Promise<Guide> {
    const rootDir = await getGuidesRoot();
    const guideDataFile = await join(rootDir, guideId, "data.json");
    const jsonString = await readTextFile(guideDataFile);
    return JSON.parse(jsonString);
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
