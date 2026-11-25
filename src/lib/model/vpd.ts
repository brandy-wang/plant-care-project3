import { assertInRange } from "./validate";

// Tetens equation coefficients, FAO-56 eq. 11 (see docs/model-science.md#vapour-pressure-deficit-vpd).
const TETENS_A_KPA = 0.6108;
const TETENS_B = 17.27;
const TETENS_C_DEG_C = 237.3;

// Plausible indoor range; outside it the model is not calibrated.
export const MIN_INDOOR_TEMP_C = -10;
export const MAX_INDOOR_TEMP_C = 50;

/** Saturation vapour pressure in kPa at air temperature `tempC` (°C). */
export function saturationVaporPressureKPa(tempC: number): number {
  return TETENS_A_KPA * Math.exp((TETENS_B * tempC) / (tempC + TETENS_C_DEG_C));
}

/** Vapour pressure deficit in kPa: how strongly the air pulls water out of soil and leaves. */
export function vpdKPa(tempC: number, rhPct: number): number {
  assertInRange("rhPct", rhPct, 0, 100);
  assertInRange("tempC", tempC, MIN_INDOOR_TEMP_C, MAX_INDOOR_TEMP_C);
  return saturationVaporPressureKPa(tempC) * (1 - rhPct / 100);
}
