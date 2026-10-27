export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function ratingDots(rating) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating)) || 0));
  return "●".repeat(n) + "○".repeat(5 - n);
}

export function ratingTone(rating) {
  if (rating >= 4) return "good";
  if (rating === 3) return "ok";
  return "bad";
}

export function ratingBadge(rating) {
  const badge = el("span", `rating rating--${ratingTone(rating)}`, ratingDots(rating));
  badge.setAttribute("role", "img");
  badge.setAttribute("aria-label", `${rating} von 5`);
  return badge;
}
