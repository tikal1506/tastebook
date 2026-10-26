import { getProducts, addProduct, removeProduct, findByBarcode, mergeProducts } from "./products.js";
import { renderList, formatProduct } from "./list.js";
import { exportProducts, readBackupFile } from "./backup.js";
import { createScanner } from "./scanner.js";
import { registerServiceWorker } from "./pwa.js";

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");
const barcodeInput = document.getElementById("barcode");
const scanResult = document.getElementById("scan-result");
const importFile = document.getElementById("import-file");

function render() {
  renderList(list, getProducts(), {
    onDelete: (id) => {
      removeProduct(id);
      render();
    },
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  addProduct({
    name: document.getElementById("name").value.trim(),
    barcode: barcodeInput.value.trim(),
    rating: Number(document.getElementById("rating").value),
    note: document.getElementById("note").value.trim(),
  });

  form.reset();
  render();
});

document.getElementById("export-button").addEventListener("click", () => {
  exportProducts(getProducts());
});

document.getElementById("import-button").addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  if (!file) return;

  try {
    const added = mergeProducts(await readBackupFile(file));
    render();
    alert(`${added} Einträge importiert.`);
  } catch (error) {
    alert("Import fehlgeschlagen: " + error.message);
  }

  importFile.value = "";
});

createScanner({
  buttonEl: document.getElementById("scan-button"),
  readerEl: document.getElementById("reader"),
  onStart: () => {
    scanResult.textContent = "";
  },
  onCode: (code) => {
    const found = findByBarcode(code);
    if (found) {
      scanResult.textContent = `Schon getrunken: ${formatProduct(found)}`;
    } else {
      scanResult.textContent = `Neu! Barcode ${code} ist noch nicht gespeichert.`;
      barcodeInput.value = code;
    }
  },
  onError: (error) => {
    scanResult.textContent = "Kamera konnte nicht gestartet werden: " + error;
  },
});

registerServiceWorker();
render();
