const LABEL_OPEN = "Packung scannen";
const LABEL_CLOSE = "Scanner schließen";

export function createScanner({ buttonEl, readerEl, onStart, onCode, onError }) {
  let scanner = null;

  async function stop() {
    const current = scanner;
    scanner = null;

    if (current) {
      try {
        await current.stop();
        current.clear();
      } catch {}
    }

    readerEl.hidden = true;
    buttonEl.textContent = LABEL_OPEN;
  }

  async function start() {
    readerEl.hidden = false;
    buttonEl.textContent = LABEL_CLOSE;
    onStart();

    try {
      const instance = new Html5Qrcode(readerEl.id, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ],
      });
      scanner = instance;

      await instance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (code) => {
          if (scanner !== instance) return;
          stop();
          onCode(code);
        }
      );
    } catch (error) {
      await stop();
      onError(error);
    }
  }

  buttonEl.addEventListener("click", () => (scanner ? stop() : start()));
}
