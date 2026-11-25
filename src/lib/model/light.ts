import { assertInRange } from "./validate";

export function dliFromLux(lux: number, hours: number): number {
  assertInRange("lux", lux, 0, 200_000);
  assertInRange("hours", hours, 0, 24);
  return ((lux / 54) * hours * 3600) / 1_000_000;
}
