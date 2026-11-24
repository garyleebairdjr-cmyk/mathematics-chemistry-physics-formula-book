import { useId, useState, type ReactNode } from "react";

/** A term that explains itself on hover, focus, or tap. */
export function Def({ term, definition }: { term: ReactNode; definition: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="sym-def inline bg-transparent p-0 text-inherit"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {term}
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute top-full left-0 z-40 mt-1 w-64 rounded-lg border border-line bg-card px-3 py-2 text-left text-xs font-normal tracking-normal text-ink normal-case shadow-sm"
        >
          {definition}
        </span>
      ) : null}
    </span>
  );
}
