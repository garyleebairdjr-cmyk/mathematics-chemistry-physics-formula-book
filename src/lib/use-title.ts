import { useEffect } from "react";

export const APP_NAME = "Formula Book";

/** Set the browser tab title for the current page. */
export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · ${APP_NAME}`
      : `${APP_NAME} — Mathematics, Chemistry & Physics`;
  }, [title]);
}
