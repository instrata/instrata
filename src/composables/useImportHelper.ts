import { useGuideIds } from "@/composables/storage/useGuideIds.ts";
import { stat } from "@tauri-apps/plugin-fs";
import { invokeImportGuide } from "@/api/commands";
import { toast } from "vue-sonner";
import { useI18n } from "vue-i18n";
import { extractFilenameFromPath } from "@/lib/utils.ts";

type UseImportHelperReturn = {
  importPaths: (paths: string[]) => Promise<void>
}

export function useImportHelper(): UseImportHelperReturn {
  const { t } = useI18n();
  const { refresh } = useGuideIds();

  async function importPaths(paths: string[]): Promise<void> {
    for (const path of paths) {
      try {
        const fileInfo = await stat(path)
        if (fileInfo.isFile) {
          await invokeImportGuide(path);
          // } else if (fileInfo.isDirectory) {
          //   await invokeLinkExternalGuide(path);
        } else {
          toast.error(
              t('components.import-helper.unsupported-path'),
              { description: path },
          );
        }
      } catch (e) {
        const fname = extractFilenameFromPath(path);
        toast.error(
            t('components.import-helper.import-failed', { fname }),
            {
              description: e instanceof Error ? `${e.name}: ${e.message}` : `${e}`,
            },
        );
      }
    }
    await refresh();
  }

  return {
    importPaths,
  };
}
