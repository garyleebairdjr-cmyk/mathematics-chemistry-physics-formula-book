import { useSyncExternalStore } from "react";
import { getSpeechStatus, onSpeechStatus } from "./engine";

/** Live speech status (speaking, which engine, last server error). */
export function useSpeechStatus() {
  return useSyncExternalStore(onSpeechStatus, getSpeechStatus, getSpeechStatus);
}
