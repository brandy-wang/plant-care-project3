import Link from "next/link";
import { predictWatering } from "@/lib/model";
import { SAMPLE_PLANTS } from "@/lib/plants/sample-plants";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Your plants</h1>
      <p className="mt-1 text-zinc-500">Predicted from your room&apos;s light, humidity and pot — tap a plant to see why.</p>
      <ul className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {SAMPLE_PLANTS.map((p) => {
          const { earliestDays, latestDays, capped } = predictWatering(p.plant, p.env);
          return (
            <li key={p.id}>
              <Link href={`/plants/${p.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <span>
                  <span className="block font-medium">{p.name}</span>
                  <span className="block text-sm text-zinc-500">{p.room}</span>
                </span>
                <span className="shrink-0 text-right font-mono text-sm">
                  {capped ? "check soil" : `${earliestDays}–${latestDays} days`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
