import { h, ref, toRaw } from "vue";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { toast } from "vue-sonner";
import { relaunch } from "@tauri-apps/plugin-process";
import { Progress } from "@/components/ui/progress";
import { getRuntimeInfo } from "@/api/commands";

const isChecking = ref(false);
const update = ref<Update | null>(null);

export function useUpdaterToasts() {
    async function checkCanAutoUpdate(): Promise<boolean> {
        const runtimeInfo = await getRuntimeInfo();
        return (
            runtimeInfo.os === "windows" && runtimeInfo.install === "exe"
            || runtimeInfo.os === "linux" && runtimeInfo.install === "appimage"
            || runtimeInfo.os === "macos" && runtimeInfo.install === "dmg"
        )
    }

    async function checkForUpdate(): Promise<void> {
        if (isChecking.value) return;
        await handleCheckForUpdate();
    }

    async function handleCheckForUpdate(): Promise<void> {
        isChecking.value = true;
        try {
            update.value = await check();
        } finally {
            isChecking.value = false;
        }

        if (update.value) {
            toast.info(`Update available: version ${update.value.version}`, {
                description: `You are on ${update.value.currentVersion}. Click Download to start.`,
                dismissible: true,
                closeButton: true,
                duration: Infinity,
                action: {
                    label: "Download",
                    onClick: () => handleDownloadUpdate(),
                },
            });
        }
    }

    async function handleDownloadUpdate(): Promise<void> {
        if (!update.value) return;

        let downloaded = 0;
        let contentLength = 0;
        let toastId: string | number | undefined = undefined;

        function progressToast() {
            toastId = toast.loading("Downloading update...", {
                id: toastId,
                dismissible: false,
                duration: Infinity,
                description: () => {
                    const modelValue = (100 * downloaded / contentLength);
                    return !isNaN(modelValue) ? h(Progress, { modelValue, class: "w-full" }) : null;
                },
            });
        }
        progressToast();

        try {
            // required work around. otherwise we get an TypeError
            const downloadFn = update.value.download.bind(toRaw(update.value));
            await downloadFn((event) => {
                switch (event.event) {
                    case "Started":
                        contentLength = event.data.contentLength ?? 0;
                        progressToast();
                        console.log(`Download started with ${contentLength}`);
                        break;
                    case "Progress":
                        downloaded += event.data.chunkLength;
                        progressToast();
                        break;
                    case "Finished":
                        console.log("Download finished");
                        break;
                    default:
                        console.log("Unknown Download Event", event);
                }
            });
        } catch (error) {
            toast.error("Download failed", {
                id: toastId,
                description: "Check your internet connection and try again."
            });
            throw error;
        }

        toast.info("Update ready to install", {
            description: `Version ${update.value.version} is downloaded. Click Install to proceed.`,
            id: toastId,
            dismissible: false,
            duration: Infinity,
            action: {
                label: "Install",
                onClick: () => handleInstallUpdate(),
            },
        });
    }

    async function handleInstallUpdate(): Promise<void> {
        if (!update.value) return;

        try {
            // required work around. otherwise we get an TypeError
            const installFn = update.value.install.bind(toRaw(update.value));
            await installFn();
        } catch (error) {
            toast.error("Installation failed", {
                description: "Please restart and try again. If the issue persists, reinstall manually.",
            });
            throw error;
        }

        toast.info("Update installed", {
            description: `Version ${update.value.version} is ready. Relaunch the app to apply the update.`,
            dismissible: true,
            closeButton: true,
            duration: Infinity,
            action: {
                label: "Restart now",
                onClick: () => handleRelaunchApp(),
            },
        });
    }

    async function handleRelaunchApp(): Promise<void> {
        await relaunch();
    }

    return { checkCanAutoUpdate, isChecking, checkForUpdate, update };
}
