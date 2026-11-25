import {
  ALLOWABLE_DEPLETION,
  SOIL_AVAILABLE_WATER_FRACTION,
  type PlantInput,
  type WateringFactors,
  type WateringPrediction,
} from "@/lib/model";

export type Effect = "sooner" | "later" | "typical";
export type Factor = "humidity" | "light" | "pot";
export type Reason = { factor: Factor; value: string; sentence: string; effect: Effect };
export type WateringExplanation = { headline: string; reasons: Reason[]; method: string };

// A heated room at 20–24 °C / 40–60 % RH sits around 1.0–1.5 kPa.
const DRY_AIR_VPD_KPA = 1.5;
const HUMID_AIR_VPD_KPA = 1.0;

// Indoor DLI bands (docs/model-science.md#daily-light-integral-dli), ascending upper bounds.
const LIGHT_BANDS: ReadonlyArray<{ below: number; label: string; effect: Effect }> = [
  { below: 2, label: "low light", effect: "later" },
  { below: 6, label: "medium light", effect: "typical" },
  { below: 12, label: "bright indirect light", effect: "sooner" },
  { below: Number.POSITIVE_INFINITY, label: "direct sun", effect: "sooner" },
];

const HUMIDITY_CLAUSE: Record<Effect, string> = {
  sooner: "dry air empties the pot faster",
  later: "humid air slows drying",
  typical: "that's typical for a heated room",
};

const kPa = (v: number) => v.toFixed(2);
const dliText = (v: number) => v.toFixed(1);
const mL = (litres: number) => Math.round(litres * 1000);
const pct = (fraction: number) => Math.round(fraction * 100);
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function humidityReason({ vpdKPa }: WateringFactors): Reason {
  const effect: Effect = vpdKPa > DRY_AIR_VPD_KPA ? "sooner" : vpdKPa < HUMID_AIR_VPD_KPA ? "later" : "typical";
  return {
    factor: "humidity",
    value: `VPD ${kPa(vpdKPa)} kPa`,
    sentence: `The air's drying pull (vapour pressure deficit) is ${kPa(vpdKPa)} kPa; ${HUMIDITY_CLAUSE[effect]}.`,
    effect,
  };
}

function lightReason({ dli }: WateringFactors): Reason {
  const band = LIGHT_BANDS.find((b) => dli < b.below)!;
  return {
    factor: "light",
    value: `DLI ${dliText(dli)} mol/m²/day`,
    sentence: `The plant gets ${dliText(dli)} mol/m²/day — ${band.label}.`,
    effect: band.effect,
  };
}

function potReason(plant: PlantInput, { budgetL, lossLPerDay }: WateringFactors): Reason {
  const fraction = pct(SOIL_AVAILABLE_WATER_FRACTION[plant.soil]);
  const depletion = pct(ALLOWABLE_DEPLETION[plant.preference]);
  return {
    factor: "pot",
    value: `${plant.potDiameterCm} cm pot, ${plant.soil} mix`,
    sentence:
      `${capitalize(plant.soil)} mix holds about ${fraction}% plant-available water and this plant can use ` +
      `${depletion}% of it, a budget of ${mL(budgetL)} mL; it loses about ${mL(lossLPerDay)} mL/day.`,
    effect: "typical",
  };
}

/** Turn a prediction's factors into plain-language reasons. Derives wording only — no new maths. */
export function explainWatering(plant: PlantInput, prediction: WateringPrediction): WateringExplanation {
  const { factors } = prediction;
  return {
    headline: prediction.capped
      ? "Check the soil by hand — it's drying very slowly"
      : `Water in ${prediction.earliestDays}–${prediction.latestDays} days`,
    reasons: [humidityReason(factors), lightReason(factors), potReason(plant, factors)],
    method:
      `${mL(factors.budgetL)} mL ÷ ${mL(factors.lossLPerDay)} mL/day ≈ ${factors.centralDays.toFixed(1)} days, ` +
      `±15% for uncertainty in drying rate.`,
  };
}
