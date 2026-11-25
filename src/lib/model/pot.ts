import { assertInRange } from "./validate";

export const SOIL_TYPES = ["peat", "standard", "chunky", "cactus"] as const;
export type SoilType = (typeof SOIL_TYPES)[number];
export const WATERING_PREFERENCES = ["moist", "average", "dry"] as const;
export type WateringPreference = (typeof WATERING_PREFERENCES)[number];

const AVAILABLE: Record<SoilType, number> = { peat: 0.35, standard: 0.25, chunky: 0.18, cactus: 0.12 };
const DEPLETION: Record<WateringPreference, number> = { moist: 0.3, average: 0.5, dry: 0.8 };

export function potVolumeL(d: number): number {
  return (Math.PI * (d / 2) ** 2 * 0.9 * d) / 1000;
}

export function potWaterBudgetL(d: number, soil: SoilType, pref: WateringPreference): number {
  assertInRange("potDiameterCm", d, 5, 60);
  return potVolumeL(d) * AVAILABLE[soil] * DEPLETION[pref];
}
