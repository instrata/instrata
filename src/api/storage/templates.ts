import { appConfigDir, join, resourceDir } from "@tauri-apps/api/path";
import { exists, readDir, readTextFile } from "@tauri-apps/plugin-fs";

export type TemplateMeta = {
    id: string
    displayName: string | Record<string, string>
    description?: string | Record<string, string>
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
        .sort((a, b) => {
            const aName = (typeof a.displayName === "string"
                ? a.displayName
                : a.displayName["en"])
                || a.id;
            const bName = (typeof b.displayName === "string"
                ? b.displayName
                : b.displayName["en"])
                || a.id;
            return aName.localeCompare(bName);
        });
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
                const fallbackMeta: TemplateMeta = {
                    id: entry.name,
                    displayName: entry.name,
                    formats: [],
                };

                const metadataFile = await join(dir, entry.name, "metadata.json");
                if (!await exists(metadataFile)) {
                    return {
                        ...fallbackMeta,
                        description: "missing template metadata",
                    } as TemplateMeta;
                }
                const content = await readTextFile(metadataFile);
                let parsed;
                try {
                    parsed = JSON.parse(content);
                } catch (error) {
                    return {
                        ...fallbackMeta,
                        description: (error instanceof Error) ? `${error.name}: ${error.message}` : `${error}`,
                    } as TemplateMeta;
                }
                return {
                    // ensure some default value exist
                    ...fallbackMeta,
                    // update with the actual information
                    ...parsed,
                    // and ensure this is correct
                    id: entry.name,
                } as TemplateMeta;
            })
    );
}
