import { describe, expect, it } from "vitest";
import { predictWatering, type EnvInput, type PlantInput } from "@/lib/model";
import { explainWatering } from "./explain-watering";

const pothos: PlantInput = { potDiameterCm: 15, soil: "standard", preference: "average" };
const livingRoom: EnvInput = { tempC: 22, rhPct: 50, dli: 5 };
const explain = (plant: PlantInput, env: EnvInput) => explainWatering(plant, predictWatering(plant, env));
const reason = (e: ReturnType<typeof explainWatering>, f: string) => e.reasons.find((r) => r.factor === f)!;

describe("explainWatering — story 2", () => {
  it("headlines the range", () => {
    expect(explain(pothos, livingRoom).headline).toBe("Water in 9–13 days");
  });

  it("tells the user to check by hand when the prediction is capped", () => {
    expect(explain(pothos, { tempC: 20, rhPct: 100, dli: 0 }).headline).toMatch(/check the soil by hand/i);
  });

  it("gives one reason each for humidity, light and pot, in that order", () => {
    expect(explain(pothos, livingRoom).reasons.map((r) => r.factor)).toEqual(["humidity", "light", "pot"]);
  });

  it("humidity quotes VPD and classifies dry air as sooner, humid air as later", () => {
    const typical = reason(explain(pothos, livingRoom), "humidity");
    expect(typical.value).toBe("VPD 1.32 kPa");
    expect(typical.effect).toBe("typical");
    expect(reason(explain(pothos, { tempC: 26, rhPct: 30, dli: 5 }), "humidity").effect).toBe("sooner");
    expect(reason(explain(pothos, { tempC: 20, rhPct: 70, dli: 5 }), "humidity").effect).toBe("later");
  });

  it("light quotes DLI with its band", () => {
    const medium = reason(explain(pothos, livingRoom), "light");
    expect(medium.value).toBe("DLI 5.0 mol/m²/day");
    expect(medium.sentence).toMatch(/medium light/);
    expect(medium.effect).toBe("typical");
    expect(reason(explain(pothos, { ...livingRoom, dli: 1.5 }), "light").effect).toBe("later");
    expect(reason(explain(pothos, { ...livingRoom, dli: 8 }), "light").sentence).toMatch(/bright indirect/);
    expect(reason(explain(pothos, { ...livingRoom, dli: 15 }), "light").effect).toBe("sooner");
  });

  it("pot quotes diameter, soil fraction, depletion, budget and daily loss", () => {
    const pot = reason(explain(pothos, livingRoom), "pot");
    expect(pot.value).toBe("15 cm pot, standard mix");
    expect(pot.sentence).toContain("25%");
    expect(pot.sentence).toContain("50%");
    expect(pot.sentence).toContain("298 mL");
    expect(pot.sentence).toContain("28 mL/day");
  });

  it("every reason sentence starts with a capital letter", () => {
    for (const r of explain(pothos, livingRoom).reasons) expect(r.sentence[0]).toMatch(/[A-Z]/);
  });

  it("states the method with the ±15% band", () => {
    expect(explain(pothos, livingRoom).method).toMatch(/298 mL ÷ 28 mL\/day ≈ 10\.7 days, ±15%/);
  });
});
