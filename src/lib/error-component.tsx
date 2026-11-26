import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { Shell } from "@/components/shell";
import { useTitle } from "@/lib/use-title";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <TriangleAlert className="size-10 text-accent" strokeWidth={2} aria-hidden />
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
      <a href={import.meta.env.BASE_URL} className="mt-2 text-sm font-medium text-accent">
        Back to the library
      </a>
    </main>
  );
}

export function NotFound() {
  useTitle("Not found");
  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          This page is not in the book.
        </h1>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-accent">
          Back to the library
        </Link>
      </div>
    </Shell>
  );
}
