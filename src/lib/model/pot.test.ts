import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { potVolumeL, potWaterBudgetL, SOIL_TYPES, WATERING_PREFERENCES } from "./pot";

describe("AC3 — pot water budget", () => {
  it("treats a pot as a cylinder 0.9 × diameter tall", () => {
    // π · 7.5² · 13.5 / 1000
    expect(potVolumeL(15)).toBeCloseTo(2.386, 3);
  });

  it("budget = volume × available-water fraction × allowable depletion", () => {
    expect(potWaterBudgetL(15, "standard", "average")).toBeCloseTo(2.386 * 0.25 * 0.5, 3);
    expect(potWaterBudgetL(15, "cactus", "dry")).toBeCloseTo(2.386 * 0.12 * 0.8, 3);
  });

  it("orders soils by retention: peat > standard > chunky > cactus", () => {
    const b = SOIL_TYPES.map((s) => potWaterBudgetL(20, s, "average"));
    expect(SOIL_TYPES).toEqual(["peat", "standard", "chunky", "cactus"]);
    expect(b[0]).toBeGreaterThan(b[1]);
    expect(b[1]).toBeGreaterThan(b[2]);
    expect(b[2]).toBeGreaterThan(b[3]);
  });

  it("orders preferences: dry-lovers may use more of the pot before watering", () => {
    expect(WATERING_PREFERENCES).toEqual(["moist", "average", "dry"]);
    const b = WATERING_PREFERENCES.map((p) => potWaterBudgetL(20, "standard", p));
    expect(b[0]).toBeLessThan(b[1]);
    expect(b[1]).toBeLessThan(b[2]);
  });

  it("rejects diameters outside 5–60 cm", () => {
    expect(() => potWaterBudgetL(4.9, "standard", "average")).toThrow(/potDiameterCm/);
    expect(() => potWaterBudgetL(61, "standard", "average")).toThrow(RangeError);
  });

  it("property: a bigger pot never has a smaller budget", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 60, noNaN: true }),
        fc.double({ min: 5, max: 60, noNaN: true }),
        fc.constantFrom(...SOIL_TYPES),
        fc.constantFrom(...WATERING_PREFERENCES),
        (a, b, soil, pref) => {
          const [small, big] = a <= b ? [a, b] : [b, a];
          expect(potWaterBudgetL(big, soil, pref)).toBeGreaterThanOrEqual(potWaterBudgetL(small, soil, pref));
        },
      ),
    );
  });
});
