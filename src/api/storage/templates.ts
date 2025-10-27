import { appConfigDir, join, resourceDir } from "@tauri-apps/api/path";
import { exists, readDir, readTextFile } from "@tauri-apps/plugin-fs";
import type { MaybeI18nString, TemplateMetadata } from "@/types/templates.ts";


async function getBuiltinTemplatesLocation(): Promise<string> {
    return await join(await resourceDir(), "templates");
}


export async function getCustomTemplatesLocation(): Promise<string> {
    return await join(await appConfigDir(), "templates");
}


export async function findTemplates(): Promise<TemplateMetadata[]> {
    return (await Promise.all([
        findBuiltinTemplates(),
        findCustomTemplates(),
    ]))
        .flat()
        .sort((a, b) => {
            const aName = normalizeMaybeI18nString(a.displayName, "en", a.id);
            const bName = normalizeMaybeI18nString(b.displayName, "en", b.id);
            return aName.localeCompare(bName);
        });
}

async function findBuiltinTemplates(): Promise<TemplateMetadata[]> {
    const dir = await getBuiltinTemplatesLocation();
    return await findWithinDirectory(dir);
}

async function findCustomTemplates(): Promise<TemplateMetadata[]> {
    const dir = await getCustomTemplatesLocation();
    if (!await exists(dir)) return [];
    return await findWithinDirectory(dir);
}

async function findWithinDirectory(dir: string): Promise<TemplateMetadata[]> {
    const entries = await readDir(dir);
    return await Promise.all(
        entries
            .filter(entry => entry.isDirectory)
            .map(async entry => {
                const fallbackMeta: TemplateMetadata = {
                    id: entry.name,
                    displayName: entry.name,
                    formats: [],
                };

                const metadataFile = await join(dir, entry.name, "metadata.json");
                if (!await exists(metadataFile)) {
                    return {
                        ...fallbackMeta,
                        description: "missing template metadata",
                    } as TemplateMetadata;
                }
                const content = await readTextFile(metadataFile);
                let parsed;
                try {
                    parsed = JSON.parse(content);
                } catch (error) {
                    return {
                        ...fallbackMeta,
                        description: (error instanceof Error) ? `${error.name}: ${error.message}` : `${error}`,
                    } as TemplateMetadata;
                }
                return {
                    // ensure some default value exist
                    ...fallbackMeta,
                    // update with the actual information
                    ...parsed,
                    // and ensure this is correct
                    id: entry.name,
                } as TemplateMetadata;
            })
    );
}

export function normalizeMaybeI18nString(string: MaybeI18nString, locale: string, fallback?: never): undefined | string;
export function normalizeMaybeI18nString(string: MaybeI18nString, locale: string, fallback: string): string;
export function normalizeMaybeI18nString(string: MaybeI18nString, locale: string, fallback?: string): undefined | string {
  if (typeof string === "string")
    return string || fallback;
  if (typeof string === "object" && string !== null && string !== undefined)
    return (string[locale] ?? string["en"]) || fallback;
  return fallback;
}
