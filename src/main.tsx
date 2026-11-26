import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AppErrorComponent, NotFound } from "@/lib/error-component";
import { startNativeShell } from "@/lib/native";
import "./styles.css";

startNativeShell();

const router = createRouter({
  routeTree,
  // Strip the trailing slash so "/repo/" becomes "/repo" (or "" locally).
  basepath: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  defaultErrorComponent: AppErrorComponent,
  defaultNotFoundComponent: NotFound,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
