function downloadFile(blob, filename) {
    if (navigator.share) {
        try {
            const file = new File([blob], filename, { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: filename
                }).catch(e => {
                    if (e.name !== 'AbortError') fallbackDownload(blob, filename);
                });
                return;
            }
        } catch (err) {
            // Safari might throw on File constructor or navigator.canShare
        }
    }
    fallbackDownload(blob, filename);
}

function fallbackDownload(blob, filename) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
