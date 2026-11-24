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
    <label className="mt-6 flex min-h-11 items-center gap-2 rounded-lg border border-line bg-card px-3">
      <Search className="size-4 shrink-0 text-muted" />
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
