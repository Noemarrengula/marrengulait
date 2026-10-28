/**
 * Native-app behaviour for the Android build (Capacitor).
 * Everything here is a no-op on the website, so the site is unchanged.
 */
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const APP_BG = "#121212";

export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

/** Runs before React renders: marks the page as "app" so CSS can adapt it. */
export function markNativeApp(): void {
  if (!isNativeApp()) return;
  document.documentElement.classList.add("native-app");

  enableLazyImages();

  // No pinch-zoom inside the app (native apps don't zoom)
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    );
  }
}

/**
 * Every <img> created by the app loads only when it gets near the screen and
 * decodes off the main thread. Set on creation, before React assigns `src`,
 * so it covers all 33 images without editing each component.
 */
function enableLazyImages(): void {
  const original = Document.prototype.createElement;
  Document.prototype.createElement = function (
    this: Document,
    tagName: string,
    options?: ElementCreationOptions
  ): HTMLElement {
    const el = original.call(this, tagName, options) as HTMLElement;
    if (el instanceof HTMLImageElement) {
      el.loading = "lazy";
      el.decoding = "async";
    }
    return el;
  } as typeof Document.prototype.createElement;
}

/** Runs after the first render. */
export async function initNativeApp(): Promise<void> {
  if (!isNativeApp()) return;

  // Status bar in the app colour, light icons
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: APP_BG });
  } catch (e) {
    console.warn("StatusBar:", e);
  }

  // Hide the splash once the app has drawn its first screen
  try {
    await SplashScreen.hide({ fadeOutDuration: 250 });
  } catch (e) {
    console.warn("SplashScreen:", e);
  }

  setupBackButton();
  setupHaptics();
}

/** Android back button: go back; on the home screen, press twice to exit. */
function setupBackButton(): void {
  let lastBackPress = 0;

  App.addListener("backButton", ({ canGoBack }) => {
    const atHome = window.location.pathname === "/";

    if (!atHome && canGoBack) {
      window.history.back();
      return;
    }
    if (!atHome) {
      // Opened directly on an inner page (e.g. from a link): go to the home screen
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    const now = Date.now();
    if (now - lastBackPress < 2000) {
      App.exitApp();
    } else {
      lastBackPress = now;
      showExitHint();
    }
  });
}

function showExitHint(): void {
  const id = "native-exit-hint";
  document.getElementById(id)?.remove();
  const el = document.createElement("div");
  el.id = id;
  el.textContent = "Prima novamente para sair";
  el.className = "native-exit-hint";
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 2000);
}

/** Light vibration when tapping buttons and the bottom navigation. */
function setupHaptics(): void {
  let last = 0;
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("button, [role='button'], nav a")) return;
      const now = Date.now();
      if (now - last < 120) return;
      last = now;
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    },
    { capture: true, passive: true }
  );
}
