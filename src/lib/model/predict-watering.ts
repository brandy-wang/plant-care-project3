import { potWaterBudgetL, type SoilType, type WateringPreference } from "./pot";
import { vpdKPa } from "./vpd";
import { dailyWaterLossL } from "./water-loss";

export type PlantInput = { potDiameterCm: number; soil: SoilType; preference: WateringPreference };
export type EnvInput = { tempC: number; rhPct: number; dli: number };

export function predictWatering(plant: PlantInput, env: EnvInput) {
  const vpd = vpdKPa(env.tempC, env.rhPct);
  const budgetL = potWaterBudgetL(plant.potDiameterCm, plant.soil, plant.preference);
  const lossLPerDay = dailyWaterLossL(vpd, env.dli, plant.potDiameterCm);
  const clamp = (n: number) => Math.min(60, Math.max(1, n));
  return {
    earliestDays: clamp(Math.floor(budgetL / (lossLPerDay * 1.15))),
    latestDays: clamp(Math.ceil(budgetL / (lossLPerDay * 0.85))),
    factors: { vpdKPa: vpd, dli: env.dli, budgetL, lossLPerDay, centralDays: budgetL / lossLPerDay },
  };
}
