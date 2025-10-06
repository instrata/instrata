import { appConfigDir, join, resourceDir } from "@tauri-apps/api/path";
import { exists, readDir, readTextFile } from "@tauri-apps/plugin-fs";

export type TemplateMeta = {
    id: string
    displayName: string
    description?: string
    version?: string
    author?: string
    formats: string[]
    links?: Array<{
        social: string
        tooltip?: string
        url: string
    }>
}


async function getBuiltinTemplatesLocation(): Promise<string> {
    return await join(await resourceDir(), "templates");
}


export async function getCustomTemplatesLocation(): Promise<string> {
    return await join(await appConfigDir(), "templates");
}


export async function findTemplates(): Promise<TemplateMeta[]> {
    return (await Promise.all([
        findBuiltinTemplates(),
        findCustomTemplates(),
    ]))
        .flat()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

async function findBuiltinTemplates(): Promise<TemplateMeta[]> {
    const dir = await getBuiltinTemplatesLocation();
    return await findWithinDirectory(dir);
}

async function findCustomTemplates(): Promise<TemplateMeta[]> {
    const dir = await getCustomTemplatesLocation();
    if (!await exists(dir)) return [];
    return await findWithinDirectory(dir);
}

async function findWithinDirectory(dir: string): Promise<TemplateMeta[]> {
    const entries = await readDir(dir);
    return await Promise.all(
        entries
            .filter(entry => entry.isDirectory)
            .map(async entry => {
                const metaFile = await join(dir, entry.name, "metadata.json");
                const content = await readTextFile(metaFile);
                const parsed = JSON.parse(content);
                return {
                    ...parsed,
                    id: entry.name,
                } as TemplateMeta;
            })
    );
}
