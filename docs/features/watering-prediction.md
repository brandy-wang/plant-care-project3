# Feature: watering prediction (story 1) — built with strict TDD

> As an owner, I want to add a plant with its window direction, pot and soil, so that I get a
> watering prediction for my actual home.

Model maths: see `docs/model-science.md`. Code: `src/lib/model/`.

## Acceptance criteria
| # | Criterion | Test file |
|---|---|---|
| AC1 | `vpdKPa(tempC, rhPct)` uses the Tetens equation: SVP(20 °C) ≈ 2.338 kPa; VPD is 0 at 100 % RH and equals SVP at 0 % RH; rejects RH outside 0–100 and temps outside −10…50 °C with `RangeError`. | `vpd.test.ts` |
| AC2 | `dliFromLux(lux, hours)` converts a lux reading to DLI: 10 000 lux for 12 h ≈ 8.0 mol·m⁻²·d⁻¹; 0 lux ⇒ 0; rejects negative lux and hours outside 0–24. | `light.test.ts` |
| AC3 | `potWaterBudgetL(potDiameterCm, soil, preference)` returns the litres the plant may use before watering (volume × available-water fraction × allowable depletion); more retentive soil ⇒ larger budget; drier preference ⇒ larger budget; rejects diameters outside 5–60 cm. | `pot.test.ts` |
| AC4 | `dailyWaterLossL(vpdKPa, dli, potDiameterCm)` = (1.0·VPD + 0.05·DLI) mm/day × pot surface area. Never negative; increases with VPD and DLI. | `water-loss.test.ts` |
| AC5 | `predictWatering(plant, env)` returns `{ earliestDays, latestDays, factors }` using a ±25 % ET band; `1 ≤ earliestDays ≤ latestDays`; property tests: higher VPD/light never later, bigger pot / more retentive soil never sooner. | `predict-watering.test.ts` |
