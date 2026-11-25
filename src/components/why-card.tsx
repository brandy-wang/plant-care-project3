import type { Effect, WateringExplanation } from "@/lib/explain/explain-watering";

const EFFECT_STYLE: Record<Effect, { label: string; className: string }> = {
  sooner: { label: "waters sooner", className: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200" },
  later: { label: "waters later", className: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200" },
  typical: { label: "typical", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
};

const FACTOR_LABEL = { humidity: "Humidity", light: "Light", pot: "Pot & soil" } as const;

export function WhyCard({ explanation }: { explanation: WateringExplanation }) {
  return (
    <section aria-labelledby="why-heading" className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <p className="text-3xl font-semibold tracking-tight">{explanation.headline}</p>
      <h2 id="why-heading" className="mt-6 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Why
      </h2>
      <ul className="mt-3 space-y-4">
        {explanation.reasons.map((r) => {
          const effect = EFFECT_STYLE[r.effect];
          return (
            <li key={r.factor} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{FACTOR_LABEL[r.factor]}</span>
                <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">{r.value}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${effect.className}`}>{effect.label}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">{r.sentence}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 border-t border-zinc-200 pt-4 text-sm text-zinc-500 dark:border-zinc-800">
        How it&apos;s calculated: {explanation.method}
      </p>
    </section>
  );
}
