import { potWaterBudgetL, type SoilType, type WateringPreference } from "./pot";
import { vpdKPa } from "./vpd";
import { dailyWaterLossL } from "./water-loss";

// ±15 % uncertainty on evapotranspiration (docs/model-science.md#prediction-range).
const ET_UNCERTAINTY = 0.15;
export const MIN_PREDICTION_DAYS = 1;
export const MAX_PREDICTION_DAYS = 60;

export type PlantInput = {
  potDiameterCm: number;
  soil: SoilType;
  preference: WateringPreference;
};

export type EnvInput = {
  tempC: number;
  rhPct: number;
  /** Daily light integral, mol·m⁻²·d⁻¹ (see dliFromLux). */
  dli: number;
};

/** Every intermediate number, so the UI and the agent can explain the range without recomputing. */
export type WateringFactors = {
  vpdKPa: number;
  dli: number;
  budgetL: number;
  lossLPerDay: number;
  centralDays: number;
};

export type WateringPrediction = {
  earliestDays: number;
  latestDays: number;
  factors: WateringFactors;
};

function clampDays(days: number): number {
  return Math.min(MAX_PREDICTION_DAYS, Math.max(MIN_PREDICTION_DAYS, days));
}

/** Predict how many days until a plant needs water, as a range with its factors. */
export function predictWatering(plant: PlantInput, env: EnvInput): WateringPrediction {
  const vpd = vpdKPa(env.tempC, env.rhPct);
  const budgetL = potWaterBudgetL(plant.potDiameterCm, plant.soil, plant.preference);
  const lossLPerDay = dailyWaterLossL(vpd, env.dli, plant.potDiameterCm);

  const fastLoss = lossLPerDay * (1 + ET_UNCERTAINTY);
  const slowLoss = lossLPerDay * (1 - ET_UNCERTAINTY);

  return {
    earliestDays: clampDays(Math.floor(budgetL / fastLoss)),
    latestDays: clampDays(Math.ceil(budgetL / slowLoss)),
    factors: { vpdKPa: vpd, dli: env.dli, budgetL, lossLPerDay, centralDays: budgetL / lossLPerDay },
  };
}
