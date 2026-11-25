import {
  ALLOWABLE_DEPLETION,
  SOIL_AVAILABLE_WATER_FRACTION,
  type PlantInput,
  type WateringPrediction,
} from "@/lib/model";

export type Effect = "sooner" | "later" | "typical";
export type Reason = { factor: "humidity" | "light" | "pot"; value: string; sentence: string; effect: Effect };
export type WateringExplanation = { headline: string; reasons: Reason[]; method: string };

export function explainWatering(plant: PlantInput, p: WateringPrediction): WateringExplanation {
  const { vpdKPa, dli, budgetL, lossLPerDay, centralDays } = p.factors;
  const budgetMl = Math.round(budgetL * 1000);
  const lossMl = Math.round(lossLPerDay * 1000);

  const humidityEffect: Effect = vpdKPa > 1.5 ? "sooner" : vpdKPa < 1.0 ? "later" : "typical";
  const band = dli < 2 ? "low light" : dli < 6 ? "medium light" : dli < 12 ? "bright indirect light" : "direct sun";
  const lightEffect: Effect = dli < 2 ? "later" : dli >= 6 ? "sooner" : "typical";
  const fraction = Math.round(SOIL_AVAILABLE_WATER_FRACTION[plant.soil] * 100);
  const depletion = Math.round(ALLOWABLE_DEPLETION[plant.preference] * 100);

  return {
    headline: p.capped
      ? "Check the soil by hand — it's drying very slowly"
      : `Water in ${p.earliestDays}–${p.latestDays} days`,
    reasons: [
      {
        factor: "humidity",
        value: `VPD ${vpdKPa.toFixed(2)} kPa`,
        sentence: `The air's drying pull (vapour pressure deficit) is ${vpdKPa.toFixed(2)} kPa; ${
          humidityEffect === "sooner" ? "dry air empties the pot faster" : humidityEffect === "later" ? "humid air slows drying" : "that's typical for a heated room"
        }.`,
        effect: humidityEffect,
      },
      {
        factor: "light",
        value: `DLI ${dli.toFixed(1)} mol/m²/day`,
        sentence: `The plant gets ${dli.toFixed(1)} mol/m²/day — ${band}.`,
        effect: lightEffect,
      },
      {
        factor: "pot",
        value: `${plant.potDiameterCm} cm pot, ${plant.soil} mix`,
        sentence: `${plant.soil} mix holds about ${fraction}% plant-available water and this plant can use ${depletion}% of it, a budget of ${budgetMl} mL; it loses about ${lossMl} mL/day.`,
        effect: "typical",
      },
    ],
    method: `${budgetMl} mL ÷ ${lossMl} mL/day ≈ ${centralDays.toFixed(1)} days, ±15% for uncertainty in drying rate.`,
  };
}
