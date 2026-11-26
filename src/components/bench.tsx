import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Def } from "@/components/def";
import { defaults, toolGroups, toolsIn } from "@/lib/calc/index";
import { fmt, parseNum } from "@/lib/calc/format";
import { fieldHint, lineHint } from "@/lib/calc/hints";
import type { Tool, ToolGroup } from "@/lib/calc/types";
import { benchConstants, quantities, type Quantity } from "@/lib/calc/units";

type Tab = ToolGroup | "quantities";

const tabs: { id: Tab; title: string }[] = [
  ...toolGroups,
  { id: "quantities", title: "Quantities" },
];

export function Bench() {
  const [tab, setTab] = useState<Tab>("math");
  const [toolId, setToolId] = useState(toolsIn("math")[0].id);
  const [query, setQuery] = useState("");

  const groupTools = tab === "quantities" ? [] : toolsIn(tab);
  const shown = groupTools.filter((tool) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      tool.title.toLowerCase().includes(needle) ||
      tool.formula.toLowerCase().includes(needle) ||
      tool.blurb.toLowerCase().includes(needle)
    );
  });
  const tool = shown.find((item) => item.id === toolId) ?? shown[0];

  return (
    <div>
      <p className="text-sm font-medium tracking-wide text-accent uppercase">Instruments</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Calculators
      </h1>
      <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed">
        Compute the formulas in the book. Hover a symbol — v, V, T, n — to read what it stands for
        in that calculator. The same letter is not the same quantity everywhere. Physics and
        chemistry also convert units.
      </p>

      <div
        className="mt-6 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Calculator sections"
      >
        {tabs.map((item) => {
          const selected = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={
                "inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-sm font-medium " +
                (selected ? "bg-accent text-on-accent" : "border border-line bg-card text-ink")
              }
              onClick={() => {
                setTab(item.id);
                setQuery("");
                if (item.id !== "quantities") setToolId(toolsIn(item.id)[0].id);
              }}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {tab === "quantities" ? (
        <Converter />
      ) : (
        <div className="mt-6 lg:flex lg:items-start lg:gap-8">
          <div className="lg:w-56 lg:shrink-0">
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-card px-3">
              <span className="sr-only">Filter calculators</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </label>
            <label className="mt-3 block lg:hidden">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">
                Calculator
              </span>
              <select
                className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-3 text-sm"
                value={tool?.id ?? ""}
                onChange={(event) => setToolId(event.target.value)}
              >
                {shown.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <ul className="mt-3 hidden lg:block">
              {shown.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={
                      "flex min-h-11 w-full items-center rounded-lg px-2 text-left text-sm " +
                      (item.id === tool?.id ? "bg-accent-soft text-accent" : "text-ink")
                    }
                    onClick={() => setToolId(item.id)}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
            {shown.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No calculator matches that filter.</p>
            ) : null}
          </div>
          <div className="mt-6 min-w-0 flex-1 lg:mt-0">
            {tool ? <ToolView key={tool.id} tool={tool} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolView({ tool }: { tool: Tool }) {
  const [values, setValues] = useState(() => defaults(tool));
  const result = useMemo(() => tool.run(values), [tool, values]);

  return (
    <section>
      <h2 className="font-display text-3xl font-semibold leading-tight">{tool.title}</h2>
      <p className="mt-2 font-serif text-lg">{tool.formula}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{tool.blurb}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tool.fields.map((field) => {
          const id = `${tool.id}-${field.key}`;
          const wide = field.kind === "text" && field.wide;
          const hint = fieldHint(tool.id, field.key);
          const unit = field.kind === "number" && field.unit ? ` (${field.unit})` : "";
          return (
            <label key={field.key} className={wide ? "sm:col-span-2" : ""} htmlFor={id}>
              <span className="text-xs font-medium tracking-wide text-muted uppercase">
                {hint ? <Def term={field.label} definition={hint} /> : field.label}
                {unit}
              </span>
              {field.kind === "select" ? (
                <select
                  id={id}
                  className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-3 text-sm"
                  value={values[field.key] ?? field.defaultValue}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  value={values[field.key] ?? ""}
                  placeholder={field.kind === "text" ? field.placeholder : undefined}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  inputMode={field.kind === "number" ? "decimal" : "text"}
                  className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-3 text-sm outline-none"
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-6 panel p-4">
        {"error" in result ? (
          <p className="font-serif leading-relaxed">{result.error}</p>
        ) : (
          <>
            <dl className="flex flex-col gap-3">
              {result.lines.map((line, index) => {
                const definition =
                  lineHint(tool.id, line.label) ??
                  tool.fields
                    .map((field) => ({ field, hint: fieldHint(tool.id, field.key) }))
                    .find(
                      ({ field, hint }) =>
                        hint &&
                        (line.label === field.label ||
                          line.label.startsWith(`${field.label} `) ||
                          line.label.startsWith(`${field.label}(`)),
                    )?.hint;
                return (
                  <div
                    key={`${line.label}-${index}`}
                    className="flex flex-col gap-1 sm:flex-row sm:gap-4"
                  >
                    <dt className="shrink-0 text-sm text-muted sm:w-48">
                      {definition ? <Def term={line.label} definition={definition} /> : line.label}
                    </dt>
                    <dd className="font-serif text-lg leading-snug">{line.value}</dd>
                  </div>
                );
              })}
            </dl>
            {result.steps?.length ? (
              <ol className="mt-4 flex list-decimal flex-col gap-1 border-t border-line pt-3 pl-5 text-sm leading-relaxed text-muted">
                {result.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            {result.note ? (
              <p className="mt-3 border-l-2 border-accent pl-3 text-sm leading-relaxed">
                {result.note}
              </p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

function Converter() {
  const [quantityId, setQuantityId] = useState(quantities[0].id);
  const quantity = quantities.find((item) => item.id === quantityId) ?? quantities[0];
  const [value, setValue] = useState("1");
  const [fromId, setFromId] = useState(quantity.units[0].id);
  const [toId, setToId] = useState(quantity.units[1]?.id ?? quantity.units[0].id);

  const from = quantity.units.find((unit) => unit.id === fromId) ?? quantity.units[0];
  const to = quantity.units.find((unit) => unit.id === toId) ?? quantity.units[0];
  const parsed = parseNum(value);
  const si = parsed === null ? null : from.toSI(parsed);
  const converted = si === null ? null : to.fromSI(si);

  function chooseQuantity(id: string) {
    const next = quantities.find((item) => item.id === id) ?? quantities[0];
    setQuantityId(next.id);
    setFromId(next.units[0].id);
    setToId(next.units[1]?.id ?? next.units[0].id);
  }

  return (
    <div className="mt-6">
      <label htmlFor="quantity">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">Quantity</span>
        <select
          id="quantity"
          className="mt-1 h-11 w-full rounded-lg border border-line bg-card px-3 text-sm"
          value={quantity.id}
          onChange={(event) => chooseQuantity(event.target.value)}
        >
          {quantities.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-4 font-serif text-lg leading-relaxed">{quantity.about}</p>
      <p className="mt-2 text-sm text-muted">
        Dimension {quantity.dimension}. SI unit: {quantity.si}.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <UnitSide
          id="from-value"
          legend="From"
          value={value}
          onValue={setValue}
          unitId={from.id}
          units={quantity.units}
          onUnit={setFromId}
        />
        <UnitSide
          id="to-value"
          legend="To"
          value={converted === null ? "" : fmt(converted)}
          readOnly
          unitId={to.id}
          units={quantity.units}
          onUnit={setToId}
        />
      </div>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
        onClick={() => {
          setFromId(to.id);
          setToId(from.id);
        }}
      >
        <ArrowLeftRight className="size-4" />
        Swap units
      </button>

      <div className="mt-4 panel p-4">
        {parsed === null ? (
          <p className="font-serif">Enter a number to convert.</p>
        ) : (
          <p className="font-display text-2xl font-semibold leading-snug">
            {fmt(parsed)} {from.symbol} = {fmt(converted ?? 0)} {to.symbol}
          </p>
        )}
      </div>

      <h2 className="mt-8 font-display text-2xl font-semibold">The same amount, in every unit</h2>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {quantity.units.map((unit) => {
          const amount = si === null ? null : unit.fromSI(si);
          return (
            <li key={unit.id} className="flex min-h-11 items-baseline justify-between gap-4 py-2">
              <span>
                <span className="font-medium">
                  <Def
                    term={unit.symbol}
                    definition={`${unit.name}, a unit of ${quantity.name.toLowerCase()}. ${quantity.about}`}
                  />
                </span>
                <span className="ml-2 text-sm text-muted">{unit.name}</span>
              </span>
              <span className="font-serif">{amount === null ? "—" : fmt(amount)}</span>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">Constants the calculators use</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Defined constants are exact. G is the measured value these tools use, not a definition.
      </p>
      <dl className="mt-3 flex flex-col gap-3">
        {benchConstants.map((item) => (
          <div
            key={item.symbol}
            className="flex flex-col gap-1 border-b border-line pb-3 sm:flex-row sm:gap-4"
          >
            <dt className="shrink-0 font-serif text-lg sm:w-16">
              <Def
                term={item.symbol}
                definition={`${item.name}. The value used here is ${item.value}.`}
              />
            </dt>
            <dd className="sm:w-56 text-sm text-muted">{item.name}</dd>
            <dd className="font-serif">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function UnitSide({
  id,
  legend,
  value,
  onValue,
  unitId,
  units,
  onUnit,
  readOnly,
}: {
  id: string;
  legend: string;
  value: string;
  onValue?: (value: string) => void;
  unitId: string;
  units: Quantity["units"];
  onUnit: (id: string) => void;
  readOnly?: boolean;
}) {
  return (
    <fieldset className="rounded-lg border border-line bg-card p-3">
      <legend className="px-1 text-xs font-medium tracking-wide text-muted uppercase">
        {legend}
      </legend>
      <input
        id={id}
        value={value}
        readOnly={readOnly}
        onChange={onValue ? (event) => onValue(event.target.value) : undefined}
        inputMode="decimal"
        className="h-11 w-full bg-transparent font-display text-2xl font-semibold outline-none"
      />
      <label className="mt-2 block" htmlFor={`${id}-unit`}>
        <span className="sr-only">{legend} unit</span>
        <select
          id={`${id}-unit`}
          className="h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm"
          value={unitId}
          onChange={(event) => onUnit(event.target.value)}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.symbol})
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}
