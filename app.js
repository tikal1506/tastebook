import { getProducts, addProduct, removeProduct, findByBarcode, mergeProducts } from "./products.js";
import { renderList } from "./list.js";
import { clearVerdict, showKnown, showNew, showProblem } from "./verdict.js";
import { exportProducts, readBackupFile } from "./backup.js";
import { createScanner } from "./scanner.js";
import { registerServiceWorker } from "./pwa.js";

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");
const addDetails = document.getElementById("add-details");
const barcodeInput = document.getElementById("barcode");
const scanResult = document.getElementById("scan-result");
const importFile = document.getElementById("import-file");

function render() {
  renderList(list, getProducts().reverse(), {
    onDelete: (product) => {
      if (!confirm(`„${product.name}“ löschen?`)) return;
      removeProduct(product.id);
      render();
    },
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  addProduct({
    name: document.getElementById("name").value.trim(),
    barcode: barcodeInput.value.trim(),
    rating: Number(new FormData(form).get("rating")),
    note: document.getElementById("note").value.trim(),
  });

  form.reset();
  addDetails.open = false;
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
    alert(`${added} Einträge geladen.`);
  } catch (error) {
    alert("Die Sicherung konnte nicht geladen werden: " + error.message);
  }

  importFile.value = "";
});

createScanner({
  buttonEl: document.getElementById("scan-button"),
  readerEl: document.getElementById("reader"),
  onStart: () => clearVerdict(scanResult),
  onCode: (code) => {
    const found = findByBarcode(code);
    if (found) {
      showKnown(scanResult, found);
    } else {
      showNew(scanResult, code);
      barcodeInput.value = code;
      addDetails.open = true;
    }
  },
  onError: (error) => {
    console.error(error);
    showProblem(
      scanResult,
      "Die Kamera konnte nicht gestartet werden. Prüfe in den Browser-Einstellungen, ob diese Seite die Kamera nutzen darf."
    );
  },
});

registerServiceWorker();
render();
