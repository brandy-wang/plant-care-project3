import type { EnvInput, PlantInput } from "@/lib/model";

export type SamplePlant = {
  id: string;
  name: string;
  room: string;
  plant: PlantInput;
  env: EnvInput;
};

/** Stand-in for the Postgres data layer (src/lib/db/) until it is wired. */
export const SAMPLE_PLANTS: readonly SamplePlant[] = [
  {
    id: "pothos",
    name: "Golden pothos",
    room: "Living room, east window",
    plant: { potDiameterCm: 15, soil: "standard", preference: "average" },
    env: { tempC: 22, rhPct: 50, dli: 5 },
  },
  {
    id: "calathea",
    name: "Calathea orbifolia",
    room: "Bathroom, frosted north window",
    plant: { potDiameterCm: 14, soil: "peat", preference: "moist" },
    env: { tempC: 23, rhPct: 65, dli: 3 },
  },
  {
    id: "snake-plant",
    name: "Snake plant",
    room: "Bedroom corner, 2 m from a west window",
    plant: { potDiameterCm: 20, soil: "cactus", preference: "dry" },
    env: { tempC: 21, rhPct: 40, dli: 1.5 },
  },
];

export function getSamplePlant(id: string): SamplePlant | undefined {
  return SAMPLE_PLANTS.find((p) => p.id === id);
}
