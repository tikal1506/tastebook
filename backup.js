export function exportProducts(products) {
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `tastebook-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

export async function readBackupFile(file) {
  const data = JSON.parse(await file.text());
  if (!Array.isArray(data)) throw new Error("Keine gültige Backup-Datei");
  return data;
}
