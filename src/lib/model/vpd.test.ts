import { describe, expect, it } from "vitest";
import { saturationVaporPressureKPa, vpdKPa } from "./vpd";

describe("AC1 — vapour pressure deficit (Tetens)", () => {
  it("matches FAO-56 reference SVP values", () => {
    expect(saturationVaporPressureKPa(20)).toBeCloseTo(2.338, 3);
    expect(saturationVaporPressureKPa(25)).toBeCloseTo(3.168, 3);
  });

  it("is zero at 100% RH and equals SVP at 0% RH", () => {
    expect(vpdKPa(22, 100)).toBe(0);
    expect(vpdKPa(22, 0)).toBeCloseTo(saturationVaporPressureKPa(22), 10);
  });

  it("scales linearly with dryness", () => {
    expect(vpdKPa(20, 50)).toBeCloseTo(2.338 / 2, 3);
  });

  it("rejects RH outside 0–100", () => {
    expect(() => vpdKPa(20, -1)).toThrow(RangeError);
    expect(() => vpdKPa(20, 101)).toThrow(/rhPct/);
  });

  it("rejects indoor temperatures outside -10…50 °C", () => {
    expect(() => vpdKPa(-11, 50)).toThrow(RangeError);
    expect(() => vpdKPa(51, 50)).toThrow(/tempC/);
  });

  it("accepts cold rooms down to -10 °C (unheated porch, winter windowsill)", () => {
    expect(() => vpdKPa(-10, 50)).not.toThrow();
    expect(vpdKPa(5, 50)).toBeGreaterThan(0);
  });
});
