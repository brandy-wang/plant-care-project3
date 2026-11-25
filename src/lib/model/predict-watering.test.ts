import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { predictWatering, type EnvInput, type PlantInput } from "./predict-watering";
import { SOIL_TYPES, WATERING_PREFERENCES } from "./pot";

const pothos: PlantInput = { potDiameterCm: 15, soil: "standard", preference: "average" };
const livingRoom: EnvInput = { tempC: 22, rhPct: 50, dli: 5 };

describe("AC5 — watering prediction range", () => {
  it("predicts 9–13 days for a 15 cm pothos in a typical living room", () => {
    const p = predictWatering(pothos, livingRoom);
    expect(p.earliestDays).toBe(9);
    expect(p.latestDays).toBe(13);
  });

  it("returns the factors it used so the UI can explain them", () => {
    const { factors } = predictWatering(pothos, livingRoom);
    expect(factors.vpdKPa).toBeCloseTo(1.322, 3);
    expect(factors.dli).toBe(5);
    expect(factors.budgetL).toBeCloseTo(0.2982, 4);
    expect(factors.lossLPerDay).toBeCloseTo(0.02778, 5);
    expect(factors.centralDays).toBeCloseTo(10.735, 3);
  });

  it("caps at 60 days when the pot barely dries (saturated, dark room)", () => {
    const p = predictWatering(pothos, { tempC: 20, rhPct: 100, dli: 0 });
    expect(p.earliestDays).toBe(60);
    expect(p.latestDays).toBe(60);
    expect(p.capped).toBe(true);
  });

  it("is not capped in normal conditions", () => {
    expect(predictWatering(pothos, livingRoom).capped).toBe(false);
  });

  const plant = fc.record({
    potDiameterCm: fc.double({ min: 5, max: 60, noNaN: true }),
    soil: fc.constantFrom(...SOIL_TYPES),
    preference: fc.constantFrom(...WATERING_PREFERENCES),
  });
  const env = fc.record({
    tempC: fc.double({ min: 10, max: 35, noNaN: true }),
    rhPct: fc.double({ min: 10, max: 95, noNaN: true }),
    dli: fc.double({ min: 0, max: 30, noNaN: true }),
  });

  it("property: 1 ≤ earliest ≤ latest ≤ 60, integers", () => {
    fc.assert(
      fc.property(plant, env, (pl, e) => {
        const { earliestDays, latestDays } = predictWatering(pl, e);
        expect(Number.isInteger(earliestDays) && Number.isInteger(latestDays)).toBe(true);
        expect(earliestDays).toBeGreaterThanOrEqual(1);
        expect(earliestDays).toBeLessThanOrEqual(latestDays);
        expect(latestDays).toBeLessThanOrEqual(60);
      }),
    );
  });

  it("property: drier air or more light never makes watering later", () => {
    fc.assert(
      fc.property(plant, env, fc.double({ min: 0, max: 5, noNaN: true }), (pl, e, d) => {
        const base = predictWatering(pl, e);
        const drier = predictWatering(pl, { ...e, rhPct: Math.max(0, e.rhPct - d) });
        const brighter = predictWatering(pl, { ...e, dli: e.dli + d });
        expect(drier.factors.centralDays).toBeLessThanOrEqual(base.factors.centralDays);
        expect(brighter.factors.centralDays).toBeLessThanOrEqual(base.factors.centralDays);
        expect(drier.latestDays).toBeLessThanOrEqual(base.latestDays);
      }),
    );
  });

  it("property: a bigger pot or more retentive soil never makes watering sooner", () => {
    fc.assert(
      fc.property(plant, env, fc.double({ min: 0, max: 10, noNaN: true }), (pl, e, grow) => {
        const base = predictWatering(pl, e);
        const bigger = predictWatering({ ...pl, potDiameterCm: Math.min(60, pl.potDiameterCm + grow) }, e);
        const peat = predictWatering({ ...pl, soil: "peat" }, e);
        expect(bigger.earliestDays).toBeGreaterThanOrEqual(base.earliestDays);
        expect(peat.earliestDays).toBeGreaterThanOrEqual(base.earliestDays);
      }),
    );
  });
});
