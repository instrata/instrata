import { computed, ref, type Ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { appConfigDir, join } from "@tauri-apps/api/path";


export type AppSettings = {
  autoCheckForUpdates: boolean
  developerMode: boolean
}

const DEFAULTS: AppSettings = {
  autoCheckForUpdates: import.meta.env.PROD,
  developerMode: import.meta.env.DEV,
}


export async function getAppSettingsFileLocation(): Promise<string> {
  return await join(await appConfigDir(), "settings.json");
}


async function loadSettings(): Promise<AppSettings> {
  const fp = await getAppSettingsFileLocation();
    if (!await exists(fp)) {
        return DEFAULTS;
    }
    const stored = await readTextFile(fp);
    const loaded = JSON.parse(stored);
    return { ...DEFAULTS, ...loaded };
}
async function saveSettings(settings: AppSettings) {
  const fp = await getAppSettingsFileLocation();
  await writeTextFile(fp, JSON.stringify(settings, null, 2));
}


const settings = ref<AppSettings>(await loadSettings());
watchDebounced(settings, async (value) => {
    await saveSettings(value);
}, { deep: true, debounce: 100 });


export function useAppSettings(_?: never): Ref<AppSettings>;
export function useAppSettings<K extends keyof AppSettings>(setting: K): Ref<AppSettings[K]>;

export function useAppSettings<Option extends keyof AppSettings>(setting?: Option) {
    return setting ? computed({
        get: () => settings.value[setting],
        set: (val: AppSettings[Option]) => settings.value[setting] = val,
    }) : settings;
}
