import { assertInRange } from "./validate";

export const SOIL_TYPES = ["peat", "standard", "chunky", "cactus"] as const;
export type SoilType = (typeof SOIL_TYPES)[number];

export const WATERING_PREFERENCES = ["moist", "average", "dry"] as const;
export type WateringPreference = (typeof WATERING_PREFERENCES)[number];

export const MIN_POT_DIAMETER_CM = 5;
export const MAX_POT_DIAMETER_CM = 60;

// Standard nursery pots are ~0.9× as tall as they are wide (docs/model-science.md#pot-water-budget).
const POT_HEIGHT_TO_DIAMETER = 0.9;
const CM3_PER_L = 1000;

/** Volumetric plant-available water fraction per soil (docs/model-science.md#pot-water-budget). */
export const SOIL_AVAILABLE_WATER_FRACTION: Readonly<Record<SoilType, number>> = {
  peat: 0.35,
  standard: 0.25,
  chunky: 0.18,
  cactus: 0.12,
};

/** Share of available water a plant can use before it should be watered (FAO-56 "p"). */
export const ALLOWABLE_DEPLETION: Readonly<Record<WateringPreference, number>> = {
  moist: 0.3,
  average: 0.5,
  dry: 0.8,
};

/** Approximate soil volume in litres of a pot with top diameter `potDiameterCm`. */
export function potVolumeL(potDiameterCm: number): number {
  const radiusCm = potDiameterCm / 2;
  const heightCm = POT_HEIGHT_TO_DIAMETER * potDiameterCm;
  return (Math.PI * radiusCm ** 2 * heightCm) / CM3_PER_L;
}

/** Litres the plant may use from a freshly watered pot before it needs watering again. */
export function potWaterBudgetL(
  potDiameterCm: number,
  soil: SoilType,
  preference: WateringPreference,
): number {
  assertInRange("potDiameterCm", potDiameterCm, MIN_POT_DIAMETER_CM, MAX_POT_DIAMETER_CM);
  return potVolumeL(potDiameterCm) * SOIL_AVAILABLE_WATER_FRACTION[soil] * ALLOWABLE_DEPLETION[preference];
}
