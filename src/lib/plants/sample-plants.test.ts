import { describe, expect, it } from "vitest";
import { predictWatering } from "@/lib/model";
import { getSamplePlant, SAMPLE_PLANTS } from "./sample-plants";

describe("sample plants", () => {
  it("have unique ids", () => {
    const ids = SAMPLE_PLANTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("are all valid model inputs", () => {
    for (const p of SAMPLE_PLANTS) expect(() => predictWatering(p.plant, p.env)).not.toThrow();
  });

  it("looks plants up by id", () => {
    expect(getSamplePlant("pothos")?.name).toBe("Golden pothos");
    expect(getSamplePlant("nope")).toBeUndefined();
  });
});
