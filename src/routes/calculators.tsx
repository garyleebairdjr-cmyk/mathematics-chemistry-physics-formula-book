import { createFileRoute } from "@tanstack/react-router";
import { Bench } from "@/components/bench";
import { Shell } from "@/components/shell";
import { useTitle } from "@/lib/use-title";

export const Route = createFileRoute("/calculators")({
  component: Calculators,
});

function Calculators() {
  useTitle("Calculators");
  return (
    <Shell>
      <Bench />
    </Shell>
  );
}
