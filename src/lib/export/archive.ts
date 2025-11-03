import { invokeExportGuide } from "@/api/commands";
import { startBlobDownload } from "@/lib/export/utils.ts";

export async function exportGuideToArchive(guideId: string): Promise<void> {
  const zipBlob = await invokeExportGuide(guideId);

  await startBlobDownload(zipBlob, "guide.zip");
}
