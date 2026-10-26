export function formatProduct(p) {
  return `${p.name} ${"★".repeat(p.rating)} ${p.note}`.trim();
}

export function renderList(listEl, products, { onDelete }) {
  const items = products.map((p) => {
    const li = document.createElement("li");
    li.textContent = formatProduct(p) + " ";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", () => onDelete(p.id));

    li.appendChild(deleteButton);
    return li;
  });

  listEl.replaceChildren(...items);
}
