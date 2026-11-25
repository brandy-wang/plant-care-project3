# PRD — Transparent Plant Care (P3)

## Problem
Houseplants die from the wrong amount of water and light, and care apps don't explain their advice.
Planta and Greg list the factors they use but don't publish how their schedules are calculated or how
accurate they are. Photo-based AI (e.g. asking Gemini) only helps once a plant already looks sick.

## Target users
People with a few to a few dozen indoor houseplants — especially renters and students in apartments,
beginners who have lost plants before, and people who travel and need someone else to water.

## Product idea
A plant care app that predicts care **before** problems show, using a transparent model built from
published plant science:

- **Light** — estimate daily light integral (DLI) from window direction, latitude, sun position and
  cloud cover, or from a phone lux reading.
- **Water** — a soil-moisture model driven by temperature and humidity (VPD), light, pot size and soil type.
- **Explainability** — every suggestion shows *why*, with the numbers, as a range ("water in 3–5 days").
- **Accuracy page** — predicted vs. actual watering, compared with a fixed schedule.

## Roles
| Role | Can do |
|---|---|
| Owner | Set up plants, see predictions and explanations, share plants, view accuracy |
| Plant sitter | See only today's tasks for shared plants; log "done" or "soil still wet" (feeds accuracy data) |

## User stories
1. As an owner, I want to add a plant with its window direction, pot and soil, so that I get a watering prediction for my actual home.
2. As an owner, I want to see why a watering date was suggested (light, humidity, pot), so that I can trust or correct it.
3. As an owner, I want to log "watered" or "soil still wet", so that the predictions adapt to each plant.
4. As an owner, I want to share selected plants with a sitter while I travel, so that someone else can care for them without long instructions.
5. As a sitter, I want to see only today's tasks for the plants I'm watching, so that I don't have to learn the whole app.
6. As an owner, I want to ask the assistant questions like "why water sooner this week?", so that I get answers based on my plant's own numbers.
7. As an owner, I want to see how accurate past predictions were compared with a fixed schedule, so that I know whether the model works.

## AI feature
An in-app Claude Agent SDK agent that calls the model functions **as tools** and explains suggestions in
plain language, so it never invents advice that the model didn't compute.

## Stack
Next.js (App Router), Postgres, auth (Auth.js or Clerk), Vercel. The model is pure functions, so it suits
TDD, fast-check property tests and Stryker mutation testing.

## Out of scope
Smart-home sensors; plant identification from photos.

## HW4 scope (this milestone)
- **TDD feature (Part 3):** story 1's core — the watering-prediction model (`src/lib/model/`).
- **Explore→Plan→Implement→Commit feature (Part 2):** story 2 — the "why" explanation and a plant page that shows it.
