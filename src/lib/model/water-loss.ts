import { assertInRange } from "./validate";

export function evapotranspirationMmPerDay(vpdKPa: number, dli: number): number {
  return 1.0 * vpdKPa + 0.05 * dli;
}

export function dailyWaterLossL(vpdKPa: number, dli: number, potDiameterCm: number): number {
  assertInRange("vpdKPa", vpdKPa, 0, 10);
  assertInRange("dli", dli, 0, 80);
  assertInRange("potDiameterCm", potDiameterCm, 5, 60);
  return evapotranspirationMmPerDay(vpdKPa, dli) * Math.PI * (potDiameterCm / 200) ** 2;
}
