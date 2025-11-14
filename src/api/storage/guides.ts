import type { Guide, GuideInfo } from "@/types/storage.ts";
import { appDataDir, join } from "@tauri-apps/api/path";
import { copyFile, exists, mkdir, readDir, readTextFile, remove, stat, writeTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { AsyncArray } from "@/lib/async-array.ts";


const MARKER_FILE = ".instrata";
const DATA_JSON = "data.json";
const IMAGES_DIR = "images";


export async function getGuidesRoot(): Promise<string> {
    const dir = await join(await appDataDir(), "guides");
    if (!await exists(dir)) await mkdir(dir, { recursive: true });
    return dir;
}

export async function listGuidesIds(): Promise<string[]> {
    const rootDir = await getGuidesRoot();
    return new AsyncArray(await readDir(rootDir))
        .filter(async (e) => e.isDirectory && (await exists(await join(rootDir, e.name, MARKER_FILE))))
        .map(e => e.name);
}

export async function existsGuide(guideId: string): Promise<boolean> {
    const rootDir = await getGuidesRoot();
    const guideDir = await join(rootDir, guideId);
    const markerFile = await join(guideDir, MARKER_FILE);
    return await exists(guideDir) && await exists(markerFile);
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
    // create marker
    await writeTextFile(await join(guideDir, MARKER_FILE), "", { createNew: true });
    // create data-file
    const jsonString = JSON.stringify(guide, null, 2);
    await writeTextFile(await join(guideDir, DATA_JSON), jsonString, { createNew: true });
    // create directory for images
    await mkdir(await join(guideDir, IMAGES_DIR));
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
    await writeTextFile(await join(guideDir, DATA_JSON), jsonString);

    await mkdir(await join(guideDir, IMAGES_DIR), { recursive: true });

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
    const guideDataFile = await join(rootDir, guideId, DATA_JSON);
    const jsonString = await readTextFile(guideDataFile);
    return {
      ...JSON.parse(jsonString),
      id: guideId,
    };
}

export async function loadGuideInfo(guideId: string): Promise<GuideInfo> {
  const rootDir = await getGuidesRoot();
  const guideDir = await join(rootDir, guideId);
  // const dirInfo = await lstat(guideDir);
  const guideDataFile = await join(guideDir, DATA_JSON);
  const fileInfo = await stat(guideDataFile);
  return {
    lastModifiedTime: fileInfo.mtime,
    birthTime: fileInfo.birthtime,
    // isExternal: dirInfo.isSymlink,
  };
}

export async function saveGuide(guide: Guide): Promise<void> {
    const rootDir = await getGuidesRoot();
    const guideDataFile = await join(rootDir, guide.id, DATA_JSON);
    const jsonString = JSON.stringify(guide, null, 2);
    await writeTextFile(guideDataFile, jsonString);
}

export async function deleteGuide(guideId: string): Promise<void> {
    const rootDir = await getGuidesRoot();
    const guideDir = await join(rootDir, guideId);
    await remove(guideDir, { recursive: true });
}

export async function importImageToGuide(file: string, guideId: string): Promise<string> {
  const imageId = nanoid();
  const dist = await join(await getGuidesRoot(), guideId, IMAGES_DIR, `${imageId}.png`);
  await copyFile(file, dist);
  return imageId;
}

export async function getGuideImageFileSrc(guideId: string, imageId: string): Promise<string> {
  return await join(await getGuidesRoot(), guideId, IMAGES_DIR, `${imageId}.png`);
}
