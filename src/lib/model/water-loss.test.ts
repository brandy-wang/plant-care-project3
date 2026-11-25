import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { dailyWaterLossL, evapotranspirationMmPerDay } from "./water-loss";

describe("AC4 — daily water loss from the pot", () => {
  it("ET = 1.0·VPD + 0.05·DLI mm/day", () => {
    expect(evapotranspirationMmPerDay(1.2, 5)).toBeCloseTo(1.45, 10);
  });

  it("loss = ET × pot surface area (1 mm over 1 m² = 1 L)", () => {
    const areaM2 = Math.PI * 0.075 ** 2; // 15 cm pot
    expect(dailyWaterLossL(1.2, 5, 15)).toBeCloseTo(1.45 * areaM2, 6);
  });

  it("rejects negative VPD or DLI", () => {
    expect(() => dailyWaterLossL(-0.1, 5, 15)).toThrow(/vpdKPa/);
    expect(() => dailyWaterLossL(1, -1, 15)).toThrow(/dli/);
    expect(() => dailyWaterLossL(1, 5, 2)).toThrow(/potDiameterCm/);
  });

  const vpd = fc.double({ min: 0, max: 6, noNaN: true });
  const dli = fc.double({ min: 0, max: 40, noNaN: true });
  const d = fc.double({ min: 5, max: 60, noNaN: true });

  it("property: never negative", () => {
    fc.assert(fc.property(vpd, dli, d, (v, l, p) => dailyWaterLossL(v, l, p) >= 0));
  });

  it("property: increases with VPD and with light", () => {
    fc.assert(
      fc.property(vpd, dli, d, fc.double({ min: 0.01, max: 2, noNaN: true }), (v, l, p, delta) => {
        expect(dailyWaterLossL(v + delta, l, p)).toBeGreaterThan(dailyWaterLossL(v, l, p));
        expect(dailyWaterLossL(v, l + delta, p)).toBeGreaterThan(dailyWaterLossL(v, l, p));
      }),
    );
  });
});
