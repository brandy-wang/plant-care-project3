import { MAX_POT_DIAMETER_CM, MIN_POT_DIAMETER_CM } from "./pot";
import { assertInRange } from "./validate";

// Simplified indoor ET coefficients (docs/model-science.md#daily-water-loss).
const ET_MM_PER_KPA = 1.0;
const ET_MM_PER_DLI = 0.05;
const MAX_VPD_KPA = 10;
const MAX_DLI = 80;
const CM_PER_M = 100;

/** Evapotranspiration in mm/day driven by air dryness (VPD) and light (DLI). */
export function evapotranspirationMmPerDay(vpdKPa: number, dli: number): number {
  return ET_MM_PER_KPA * vpdKPa + ET_MM_PER_DLI * dli;
}

/** Exposed soil surface of a pot in m². */
export function potSurfaceAreaM2(potDiameterCm: number): number {
  const radiusM = potDiameterCm / 2 / CM_PER_M;
  return Math.PI * radiusM ** 2;
}

/** Litres lost per day; 1 mm of ET over 1 m² equals 1 L. */
export function dailyWaterLossL(vpdKPa: number, dli: number, potDiameterCm: number): number {
  assertInRange("vpdKPa", vpdKPa, 0, MAX_VPD_KPA);
  assertInRange("dli", dli, 0, MAX_DLI);
  assertInRange("potDiameterCm", potDiameterCm, MIN_POT_DIAMETER_CM, MAX_POT_DIAMETER_CM);
  return evapotranspirationMmPerDay(vpdKPa, dli) * potSurfaceAreaM2(potDiameterCm);
}
