import { describe, expect, it } from "vitest";
import { assertInRange } from "./validate";
import { vpdKPa } from "./vpd";

describe("assertInRange", () => {
  it("accepts the inclusive bounds", () => {
    expect(() => assertInRange("x", 0, 0, 10)).not.toThrow();
    expect(() => assertInRange("x", 10, 0, 10)).not.toThrow();
  });

  it("rejects NaN and infinities, naming the parameter", () => {
    expect(() => assertInRange("x", Number.NaN, 0, 10)).toThrow(/x must be between 0 and 10/);
    expect(() => assertInRange("x", Number.POSITIVE_INFINITY, 0, 1e9)).toThrow(RangeError);
  });

  it("protects vpdKPa from NaN sensor readings", () => {
    expect(() => vpdKPa(Number.NaN, 50)).toThrow(/tempC/);
    expect(() => vpdKPa(20, Number.NaN)).toThrow(/rhPct/);
  });
});
