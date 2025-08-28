export function startBlobDownload(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);

    try {
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export function startTextDownload(content: string, filename: string): void {
    const blob = new Blob([content], { type: "text/plain" })
    return startBlobDownload(blob, filename);
}
