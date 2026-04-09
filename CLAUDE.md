# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository contains a **single-file React application** named `code` (no extension). It is a JavaScript/JSX file that exports a default React component.

- `code` — the entire application: a travel packing list generator called **PackPerfect**

## Architecture

The entire app lives in one file (`code`) and is a self-contained React component with no build system, package.json, or external dependencies defined in this repo. The file structure within `code`:

1. **Embedded base64 images** (lines ~3–7): `IMG_WARM`, `IMG_COLD`, `IMG_NORM`, `IMG_BIZ` — JPEG images for the Visual Aid tab
2. **`DESTINATIONS` array** (line ~8): ~200 world cities used for autocomplete
3. **Climate/trip logic** (lines ~53–91):
   - `classifyClimate(dest)` — maps destination string to `tropical | cold | desert | warm | temperate`
   - `getVisualCategory/getVisualImage` — picks the right hero image per trip type/climate
   - `suggestTripTypes(climate)` — returns relevant trip type options per climate
4. **`generateList(tripType, days, climate)`** (line ~97): Core packing logic. Returns `{ items, laundryNote }` where `items` is an object keyed by category (`Clothing`, `Footwear`, `Toiletries`, `Electronics`, `Documents`, `Health`). Each item has `{ name, qty, weight, packed, bag }`.
5. **Weather integration** (lines ~279–306): `WEATHER_CODES` map and `getPackingTip()` — uses Open-Meteo API (free, no key required) + geocoding API
6. **AI knowledge base** (lines ~308–342): `AI_KB` array of keyword→answer pairs; `getAIResponse()` does keyword matching (no external AI API)
7. **`PackPerfect` default export** (line ~348): Single React component with all UI state

## Key Features & State

The `PackPerfect` component renders four tabs: `Packing List`, `Visual Aid`, `AI Assistant`, `Settings`.

State persisted to `localStorage`:
- `pp_lists` — saved packing lists (up to 10)
- `pp_dark` — dark mode preference

External API calls (in `fetchWeather`):
- `https://geocoding-api.open-meteo.com/v1/search` — city → lat/lng
- `https://api.open-meteo.com/v1/forecast` — 16-day weather forecast

## Development Notes

Since there is no `package.json` or build config in this repo, the `code` file is intended to be used as a component within a React project. To use it:
- The file uses JSX syntax and requires a React build pipeline (e.g., Vite, Create React App, Next.js)
- Import as: `import PackPerfect from './code'`
- Dependencies: `react` (uses `useState`, `useEffect`, `useRef`)

The `AI Assistant` tab uses purely local keyword matching — there is no external AI/LLM integration. Responses come from the `AI_KB` array.
