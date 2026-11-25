import Link from "next/link";
import { notFound } from "next/navigation";
import { WhyCard } from "@/components/why-card";
import { explainWatering } from "@/lib/explain/explain-watering";
import { predictWatering } from "@/lib/model";
import { getSamplePlant, SAMPLE_PLANTS } from "@/lib/plants/sample-plants";

// Cache Components requires at least one param (docs: migrating-to-cache-components).
export function generateStaticParams() {
  return SAMPLE_PLANTS.map((p) => ({ id: p.id }));
}

export default async function PlantPage({ params }: PageProps<"/plants/[id]">) {
  const { id } = await params;
  const sample = getSamplePlant(id);
  if (!sample) notFound();

  const explanation = explainWatering(sample.plant, predictWatering(sample.plant, sample.env));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← All plants
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">{sample.name}</h1>
      <p className="mb-6 text-zinc-500">
        {sample.room} · {sample.env.tempC} °C, {sample.env.rhPct}% RH
      </p>
      <WhyCard explanation={explanation} />
    </main>
  );
}
