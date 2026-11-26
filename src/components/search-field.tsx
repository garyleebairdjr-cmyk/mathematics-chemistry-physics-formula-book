import { Search } from "lucide-react";

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <label className="mt-10 flex min-h-12 items-center gap-3 rounded-full border border-line bg-card/70 px-4 focus-within:border-accent">
      <Search className="size-4 shrink-0 text-accent" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
      />
    </label>
  );
}
