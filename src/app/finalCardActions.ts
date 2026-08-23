export function canShareFinalCard(): boolean {
  if (typeof File !== "function" || typeof navigator.share !== "function") {
    return false;
  }

  const file = new File([], "scars-of-steel.png", { type: "image/png" });
  return navigator.canShare?.({ files: [file] }) ?? false;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function getFinalCardFilename(pilotName: string): string {
  const safeName = pilotName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");

  return `scars-of-steel-${safeName || "pilot"}.png`;
}
