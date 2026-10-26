const STORAGE_KEY = "tastebook-products";

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let products = load();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Speichern fehlgeschlagen:", error);
  }
}

export function getProducts() {
  return [...products];
}

export function addProduct({ name, barcode = "", rating, note = "", category = "Kaffee" }) {
  const product = { id: Date.now(), name, category, barcode, rating, note };
  products.push(product);
  save();
  return product;
}

export function removeProduct(id) {
  products = products.filter((p) => p.id !== id);
  save();
}

export function findByBarcode(code) {
  return products.find((p) => p.barcode && p.barcode === code);
}

export function mergeProducts(items) {
  const knownIds = new Set(products.map((p) => p.id));
  let added = 0;

  for (const item of items) {
    if (item && typeof item.name === "string" && !knownIds.has(item.id)) {
      products.push(item);
      knownIds.add(item.id);
      added++;
    }
  }

  if (added > 0) save();
  return added;
}
