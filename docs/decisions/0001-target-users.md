# 0001. Target users: visitors to Thailand

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
Pak Mud (Thai ปักหมุด, "drop a pin") needs a clear audience. The audience drives the UI language,
the default currency and which places and content we optimise for.

## Options considered
- Anyone, any destination: biggest market. Generic, and it competes head-on with large planners.
- Thai travelers: Thai UI first. A narrower audience, but a clear local niche.
- Visitors to Thailand: English UI, Thai destinations. A focused niche that keeps local flavour.

## Decision
Visitors to Thailand. The UI is in English first. Costs are in THB, with an optional display currency later.

## Consequences
- Place search is biased toward Thailand (country code `th`).
- Thai UI moves to V4 (i18n). Text should still go through one place so translation stays easy later.
