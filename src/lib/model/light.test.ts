import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { dliFromLux } from "./light";

describe("AC2 — daily light integral from a lux reading", () => {
  it("converts 10 000 lux over 12 h to ≈ 8.0 mol/m²/day", () => {
    expect(dliFromLux(10_000, 12)).toBeCloseTo(8.0, 1);
  });

  it("is 0 with no light or no hours", () => {
    expect(dliFromLux(0, 12)).toBe(0);
    expect(dliFromLux(5_000, 0)).toBe(0);
  });

  it("rejects negative lux and hours outside 0–24", () => {
    expect(() => dliFromLux(-1, 12)).toThrow(/lux/);
    expect(() => dliFromLux(1_000, 25)).toThrow(/hours/);
  });

  it("property: is linear in lux", () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 100_000, noNaN: true }), fc.double({ min: 0, max: 24, noNaN: true }), (lux, h) => {
        expect(dliFromLux(2 * lux, h)).toBeCloseTo(2 * dliFromLux(lux, h), 6);
      }),
    );
  });
});
