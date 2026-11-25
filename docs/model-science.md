# Model science reference

The care model is a set of pure functions in `src/lib/model/`. Every constant here must be cited in code
comments next to where it is used, and every user-facing number must come from these functions.

## Vapour pressure deficit (VPD)
Saturation vapour pressure, Tetens equation (FAO-56, eq. 11), T in °C, result in kPa:

    SVP(T) = 0.6108 · exp(17.27·T / (T + 237.3))

    VPD = SVP(T) · (1 − RH/100)

Reference values: SVP(20 °C) ≈ 2.338 kPa, SVP(25 °C) ≈ 3.168 kPa.

## Daily light integral (DLI)
Lux → PPFD for sunlight: PPFD (µmol·m⁻²·s⁻¹) ≈ lux / 54 (conversion factor for daylight; Thimijan &
Heins 1983).

    DLI (mol·m⁻²·d⁻¹) = PPFD · hours · 3600 / 1 000 000

Indoor guide: < 2 low, 2–6 medium, 6–12 bright indirect, > 12 direct sun.

## Pot water budget
Standard pot treated as a cylinder with height ≈ 0.9 × top diameter:

    volume (L) = π · (d/2)² · 0.9·d / 1000          (d in cm)

Plant-available water fraction by soil (volumetric, between field capacity and wilting):

| Soil | fraction |
|---|---|
| `peat` (moisture-retentive mix) | 0.35 |
| `standard` potting mix | 0.25 |
| `chunky` aroid mix | 0.18 |
| `cactus` gritty mix | 0.12 |

Allowable depletion before watering, by plant watering preference (FAO-56 "p" concept):

| Preference | depletion |
|---|---|
| `moist` (ferns, calathea) | 0.3 |
| `average` (pothos, monstera) | 0.5 |
| `dry` (succulents, snake plant) | 0.8 |

## Daily water loss
Evapotranspiration from the pot surface, a simplified indoor linear model:

    ET (mm/day) = 1.0 · VPD(kPa) + 0.05 · DLI

1 mm over 1 m² = 1 L, so loss (L/day) = ET · surface area (m²), surface area = π·(d/200)².

## Prediction range
Days until watering = (available water · depletion) / daily loss. Uncertainty band ±25 % on ET gives
the range: earliest = floor(budget / (loss·1.25)), latest = ceil(budget / (loss·0.75)), both ≥ 1.
