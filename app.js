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

if ("serviceWorker" in navigator && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  navigator.serviceWorker.register("sw.js");
}