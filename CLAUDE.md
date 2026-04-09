# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

- `preview/src/PackPerfect.jsx` — the entire application: a travel packing list generator called **PackPerfect**
- `preview/` — Vite + React project; `src/App.jsx` imports and renders `PackPerfect`
- `vercel.json` — tells Vercel to build from the `preview/` subdirectory
- `preview/public/` — static assets served by Vite; **this is where images must live** (e.g. `img-warm.jpg`, `img-cold.jpg`, `img-norm.jpg`, `img-biz.jpg` for the Visual Aid tab). The root `public/` folder is not served.

## Running the dev server

```bash
cd preview
npm run dev
```

## Architecture

The entire app lives in `code.jsx` — a self-contained React component. Structure within the file:

1. **Image constants** (lines ~3–6): `IMG_WARM`, `IMG_COLD`, `IMG_NORM`, `IMG_BIZ` — paths to images in `preview/public/`
2. **`DESTINATIONS` array** (line ~8): ~200 world cities used for autocomplete
3. **Climate/trip logic** (lines ~53–91):
   - `classifyClimate(dest)` — maps destination string to `tropical | cold | desert | warm | temperate`
   - `getVisualCategory/getVisualImage` — picks the right hero image per trip type/climate
   - `suggestTripTypes(climate)` — returns relevant trip type options per climate
4. **`generateList(tripType, days, climate)`** (line ~97): Core packing logic. Returns `{ items, laundryNote }` where `items` is keyed by category (`Clothing`, `Footwear`, `Toiletries`, `Electronics`, `Documents`, `Health`). Each item: `{ name, qty, weight, packed, bag }`.
5. **Weather integration** (lines ~279–306): `WEATHER_CODES` map and `getPackingTip()` — uses Open-Meteo API (free, no key required)
6. **AI knowledge base** (lines ~308–342): `AI_KB` array of keyword→answer pairs; `getAIResponse()` does keyword matching (no external AI API)
7. **`PackPerfect` default export** (line ~348): Single React component with all UI state

## Key Features & State

Four tabs: `Packing List`, `Visual Aid`, `AI Assistant`, `Settings`.

State persisted to `localStorage`:
- `pp_lists` — saved packing lists (up to 10)
- `pp_dark` — dark mode preference

External API calls (in `fetchWeather`):
- `https://geocoding-api.open-meteo.com/v1/search` — city → lat/lng
- `https://api.open-meteo.com/v1/forecast` — 16-day weather forecast (parameter: `weather_code`)

The `AI Assistant` tab uses purely local keyword matching — no external AI/LLM.
