export function registerServiceWorker() {
  const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
  if ("serviceWorker" in navigator && !isLocal) {
    navigator.serviceWorker.register("sw.js");
  }
}
