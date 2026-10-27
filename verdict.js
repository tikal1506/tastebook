import { el, ratingBadge, ratingTone } from "./ui.js";

const KNOWN_TITLES = {
  good: "Schon getrunken: gut",
  ok: "Schon getrunken: ganz okay",
  bad: "Schon getrunken: eher nicht",
};

function show(container, tone, children) {
  container.className = `verdict verdict--${tone}`;
  container.hidden = false;
  container.replaceChildren(...children);
}

export function clearVerdict(container) {
  container.className = "verdict";
  container.hidden = true;
  container.replaceChildren();
}

export function showKnown(container, product) {
  const tone = ratingTone(product.rating);
  const children = [
    el("p", "verdict-title", KNOWN_TITLES[tone]),
    ratingBadge(product.rating),
    el("p", "verdict-name", product.name),
  ];
  if (product.note) children.push(el("p", "verdict-note", product.note));
  show(container, tone, children);
}

export function showNew(container, code) {
  show(container, "new", [
    el("p", "verdict-title", "Neu"),
    el("p", "verdict-name", "Diesen Kaffee hast du noch nicht erfasst."),
    el("p", "verdict-note", `Barcode ${code}`),
  ]);
}

export function showProblem(container, text) {
  show(container, "problem", [
    el("p", "verdict-title", "Das hat nicht geklappt"),
    el("p", "verdict-note", text),
  ]);
}
