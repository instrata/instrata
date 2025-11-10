import { h, ref, toRaw } from "vue";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { toast } from "vue-sonner";
import { relaunch } from "@tauri-apps/plugin-process";
import { Progress } from "@/components/ui/progress";
import { getRuntimeInfo } from "@/api/commands";
import { useI18n } from "vue-i18n";
import { createSharedComposable } from "@vueuse/core";


export const useUpdaterToasts = createSharedComposable(() => {
  const { t } = useI18n();

  const isChecking = ref(false);
  const update = ref<Update | null>(null);

  async function checkForUpdate(): Promise<void> {
    if (isChecking.value) return;
    await handleCheckForUpdate();
  }

  async function handleCheckForUpdate(): Promise<void> {
    isChecking.value = true;
    try {
      const runtimeInfo = await getRuntimeInfo();
      update.value = await check({
        target: `${runtimeInfo.os}-${runtimeInfo.arch}-${runtimeInfo.install}`,
      });
      console.info("update", runtimeInfo, update.value);
    } catch (e) {
      console.error("update-check failed", e);
    } finally {
      isChecking.value = false;
    }

    if (update.value) {
      toast.info(
          t("updater.update-available.title", { version: update.value.version }),
          {
            description: t("updater.update-available.description", {
              currentVersion: update.value.currentVersion,
            }),
            dismissible: true,
            closeButton: true,
            duration: Infinity,
            action: {
              label: t("updater.update-available.action"),
              onClick: () => handleDownloadUpdate(),
            },
          },
      );
    }
  }

  async function handleDownloadUpdate(): Promise<void> {
    if (!update.value) return;

    let downloaded = 0;
    let contentLength = 0;
    let toastId: string | number | undefined = undefined;

    function progressToast() {
      toastId = toast.loading(t("updater.downloading.title"), {
        id: toastId,
        dismissible: false,
        duration: Infinity,
        description: () => {
          const modelValue = (100 * downloaded) / contentLength;
          return !isNaN(modelValue) ? h(Progress, { modelValue, class: "w-full" }) : null;
        },
      });
    }

    progressToast();

    try {
      // Required work around. Otherwise, we get an TypeError
      const downloadFn = update.value.download.bind(toRaw(update.value));
      await downloadFn((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 0;
            progressToast();
            console.info(`Download started with ${contentLength}`);
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            progressToast();
            break;
          case "Finished":
            console.info("Download finished");
            break;
        }
      });
    } catch (error) {
      toast.error(t("updater.download-failed.title"), {
        id: toastId,
        description: t("updater.download-failed.description"),
        dismissible: true,
      });
      throw error;
    }

    toast.info(t("updater.ready-to-install.title"), {
      description: t("updater.ready-to-install.description", {
        version: update.value.version,
      }),
      id: toastId,
      dismissible: false,
      duration: Infinity,
      action: {
        label: t("updater.ready-to-install.action"),
        onClick: () => handleInstallUpdate(),
      },
    });
  }

  async function handleInstallUpdate(): Promise<void> {
    if (!update.value) return;

    try {
      // Required work around. Otherwise, we get an TypeError
      const installFn = update.value.install.bind(toRaw(update.value));
      await installFn();
    } catch (error) {
      toast.error(t("updater.install-failed.title"), {
        description: t("updater.install-failed.description"),
      });
      throw error;
    }

    toast.info(t("updater.installed.title"), {
      description: t("updater.installed.description", {
        version: update.value.version,
      }),
      dismissible: true,
      closeButton: true,
      duration: Infinity,
      action: {
        label: t("updater.installed.action"),
        onClick: () => handleRelaunchApp(),
      },
    });
  }

  async function handleRelaunchApp(): Promise<void> {
    await relaunch();
  }

  return {isChecking, checkForUpdate, update};
});
