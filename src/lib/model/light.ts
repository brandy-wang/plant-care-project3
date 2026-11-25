import { assertInRange } from "./validate";

// Daylight lux → PPFD (µmol·m⁻²·s⁻¹) divisor, Thimijan & Heins 1983 (docs/model-science.md#daily-light-integral-dli).
const SUNLIGHT_LUX_PER_PPFD = 54;
const SECONDS_PER_HOUR = 3600;
const MICROMOL_PER_MOL = 1_000_000;
// Full summer sun is ~100–120k lux; anything far above is a sensor error.
const MAX_PLAUSIBLE_LUX = 200_000;

/** Photosynthetic photon flux density (µmol·m⁻²·s⁻¹) for a daylight lux reading. */
export function ppfdFromLux(lux: number): number {
  return lux / SUNLIGHT_LUX_PER_PPFD;
}

/** Daily light integral (mol·m⁻²·d⁻¹) for an average `lux` reading lasting `hours`. */
export function dliFromLux(lux: number, hours: number): number {
  assertInRange("lux", lux, 0, MAX_PLAUSIBLE_LUX);
  assertInRange("hours", hours, 0, 24);
  return (ppfdFromLux(lux) * hours * SECONDS_PER_HOUR) / MICROMOL_PER_MOL;
}
