const STORAGE_KEY = "tastebook-products";

function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

const products = loadProducts();

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  products.push({
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    category: "Kaffee",
    barcode: document.getElementById("barcode").value.trim(),
    rating: Number(document.getElementById("rating").value),
    note: document.getElementById("note").value.trim(),
  });

  saveProducts();
  form.reset();
  render();
});

function render() {
  list.innerHTML = "";
  for (const p of products) {
    const li = document.createElement("li");
    li.textContent = `${p.name} ${"★".repeat(p.rating)} ${p.note} `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", () => {
      const index = products.findIndex((item) => item.id === p.id);
      products.splice(index, 1);
      saveProducts();
      render();
    });

    li.appendChild(deleteButton);
    list.appendChild(li);
  }
}

render();

document.getElementById("export-button").addEventListener("click", () => {
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `tastebook-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
});

const importFile = document.getElementById("import-file");

document.getElementById("import-button").addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported)) throw new Error("Keine gültige Backup-Datei");

    const knownIds = new Set(products.map((p) => p.id));
    let added = 0;
    for (const item of imported) {
      if (item && typeof item.name === "string" && !knownIds.has(item.id)) {
        products.push(item);
        added++;
      }
    }

    saveProducts();
    render();
    alert(`${added} Einträge importiert.`);
  } catch (error) {
    alert("Import fehlgeschlagen: " + error.message);
  }

  importFile.value = "";
});

const scanButton = document.getElementById("scan-button");
const readerBox = document.getElementById("reader");
const scanResult = document.getElementById("scan-result");
let scanner = null;

async function startScanner() {
  readerBox.hidden = false;
  scanButton.textContent = "Scanner schließen";
  scanResult.textContent = "";

  scanner = new Html5Qrcode("reader", {
    formatsToSupport: [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
    ],
  });

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      onScanSuccess
    );
  } catch (error) {
    scanResult.textContent = "Kamera konnte nicht gestartet werden: " + error;
    await stopScanner();
  }
}

async function stopScanner() {
  const current = scanner;
  scanner = null;
  if (current) {
    try {
      await current.stop();
      current.clear();
    } catch {}
  }
  readerBox.hidden = true;
  scanButton.textContent = "Packung scannen";
}

function onScanSuccess(code) {
  if (!scanner) return;
  stopScanner();

  const found = products.find((p) => p.barcode === code);
  if (found) {
    scanResult.textContent = `Schon getrunken: ${found.name} ${"★".repeat(found.rating)} ${found.note}`;
  } else {
    scanResult.textContent = `Neu! Barcode ${code} ist noch nicht gespeichert.`;
    document.getElementById("barcode").value = code;
  }
}

scanButton.addEventListener("click", () => {
  console.log("Klick auf Scan");
  if (scanner) stopScanner();
  else startScanner();
});

if ("serviceWorker" in navigator && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  navigator.serviceWorker.register("sw.js");
}

console.log("Ende app.js erreicht");
console.log("scanButton:", scanButton);
console.log("Html5Qrcode:", typeof Html5Qrcode);