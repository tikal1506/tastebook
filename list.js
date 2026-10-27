import { el, ratingBadge } from "./ui.js";

export function renderList(listEl, products, { onDelete }) {
  if (products.length === 0) {
    listEl.replaceChildren(
      el("li", "empty", "Noch kein Kaffee gespeichert. Scanne einen Barcode oder erfasse einen Kaffee manuell.")
    );
    return;
  }

  const items = products.map((p) => {
    const li = el("li", "bean");

    const deleteButton = el("button", "link-button", "Löschen");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `${p.name} löschen`);
    deleteButton.addEventListener("click", () => onDelete(p));

    li.append(el("span", "bean-name", p.name), ratingBadge(p.rating));
    if (p.note) li.append(el("p", "bean-note", p.note));
    li.append(deleteButton);
    return li;
  });

  listEl.replaceChildren(...items);
}
