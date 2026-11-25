export function saturationVaporPressureKPa(tempC: number): number {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

export function vpdKPa(tempC: number, rhPct: number): number {
  if (rhPct < 0 || rhPct > 100) throw new RangeError(`rhPct must be 0–100, got ${rhPct}`);
  if (tempC < -10 || tempC > 50) throw new RangeError(`tempC must be -10–50, got ${tempC}`);
  return saturationVaporPressureKPa(tempC) * (1 - rhPct / 100);
}
