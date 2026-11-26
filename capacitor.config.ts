import type { CapacitorConfig } from "@capacitor/cli";

// The Android and iPhone apps wrap the same web build (dist/), served from inside the app.
const config: CapacitorConfig = {
  appId: "io.github.garyleebairdjrcmyk.formulabook",
  appName: "Math-Physics-Chemistry-and-Statistics",
  webDir: "dist",
  backgroundColor: "#07080d",
  android: { allowMixedContent: false },
  ios: { contentInset: "never" },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: "#07080d",
      showSpinner: false,
    },
  },
};

export default config;
