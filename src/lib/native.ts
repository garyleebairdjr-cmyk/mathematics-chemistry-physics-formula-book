import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

/** True only inside the Android or iPhone app; the website skips every native call. */
const isNative = Capacitor.isNativePlatform();

const BAR_COLOR = { light: "#f4f5f9", dark: "#07080d" } as const;

/** Set up the native shell once at startup. A no-op on the web. */
export function startNativeShell() {
  if (!isNative) return;
  document.documentElement.dataset.native = Capacitor.getPlatform();
  // Android's Back button walks back through pages, and leaves the app only from the first one.
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else App.exitApp();
  }).catch(() => {});
  // Hide the splash once the first frame is painted.
  requestAnimationFrame(() => {
    SplashScreen.hide().catch(() => {});
  });
}

/** Match the status bar to the app's light or dark appearance. A no-op on the web. */
export function syncStatusBar(resolved: "light" | "dark") {
  if (!isNative) return;
  // Style.Dark means light text, for a dark background.
  StatusBar.setStyle({ style: resolved === "dark" ? Style.Dark : Style.Light }).catch(() => {});
  if (Capacitor.getPlatform() === "android") {
    StatusBar.setBackgroundColor({ color: BAR_COLOR[resolved] }).catch(() => {});
  }
}
