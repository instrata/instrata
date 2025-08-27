import { computed, ref, type Ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";


export type AppSettings = {

}

const DEFAULTS: AppSettings = {

}


const FILENAME = "settings.json";


async function loadSettings(): Promise<AppSettings> {
    if (!await exists(FILENAME, { baseDir: BaseDirectory.AppConfig })) {
        return DEFAULTS;
    }
    const stored = await readTextFile(FILENAME, {
        baseDir: BaseDirectory.AppConfig,
    })
    const loaded = JSON.parse(stored);
    return { ...DEFAULTS, ...loaded };
}
async function saveSettings(settings: AppSettings) {
    await writeTextFile(FILENAME, JSON.stringify(settings), {
        baseDir: BaseDirectory.AppConfig,
    });
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
