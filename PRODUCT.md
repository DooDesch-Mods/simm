# Product

<!-- impeccable:product-schema 1 -->

> Facts marked *(inferred)* come from the repository (README, docs/simm-desktop-ui-redesign-spec.md, code) and were not yet confirmed by the maintainers.

## Platform

web

Tauri 2 desktop app (Windows and Linux) rendering a React web UI. The design language is a desktop utility, not native per-OS controls.

## Users

*(inferred)* Two audiences, equally weighted:

- **Players** of Schedule I who want to install, update, and remove mods without touching files. They run one environment, open SIMM before playing, and need the next safe action to be obvious.
- **Mod developers and power users** who keep several environments (branches, IL2CPP vs. Mono runtimes), read logs, edit MelonLoader configs, sideload local dev mods, and switch between them many times per session.

## Product Purpose

SIMM (Schedule I Mod Manager) creates and maintains isolated game environments, downloads mods from Thunderstore and NexusMods into a shared library, installs them runtime-aware into each environment, and handles the surrounding modding chores: MelonLoader/S1API/MLVScan frameworks, update checks, logs, configs, save backups, profiles, and security scanning. Success is a working modded game with no manual file juggling and no surprise breakage.

## Positioning

The library-first model: mods live once in a shared library and are materialized into any number of environments, each aware of its runtime (IL2CPP or Mono), so one mod library serves stable, beta, and dev setups side by side.

## Operating Context

- Opened on a desktop at 1080p, 1440p, or 4K, often right before or between game sessions, sometimes alongside the running game.
- Repeated, task-driven use: check updates, install a mod, launch, read the log when something breaks, tweak a config, relaunch.
- Long-running background work (Steam depot downloads, mod downloads, scans) runs while the user keeps working.
- Accounts: Steam (depot downloads), NexusMods (API key / SSO); credentials are stored encrypted.

## Capabilities and Constraints

- Environments: create (import Steam install or download a branch via DepotDownloader), update, delete, launch; runtime and game version detection.
- Mod Library: Discover (Thunderstore + NexusMods search, collections), downloaded Library, Updates; install targets per environment; runtime compatibility prompts.
- Per-environment managers: Mods, Plugins, UserLibs, Logs (live tail, export), Configuration (structured + raw editor).
- Profiles (export/import mod sets), Save backups, Telemetry (opt-in), Security scan reports (MLVScan), app updates (stable/beta channels).
- Themes: built-in light, dark, modern-blue, plus user-defined custom themes. Must keep working.
- The frontend talks to the backend only via `ApiService` (`src/services/api.ts`).
- Icons: FontAwesome via the `Icon` wrapper; shadcn/base-ui primitives under `src/components/ui`.
- Layout must stay stable across 1080p, 1440p, and 4K; no root-font scaling at desktop breakpoints.

## Brand Commitments

- Name: SIMM — Schedule I Mod Manager. App icon in `src-tauri/icons/`.
- Binding direction from the maintainers' spec (`docs/simm-desktop-ui-redesign-spec.md`): an operational desktop utility, not a web dashboard. No landing-page heroes, bento grids, feature-card grids, glows, decorative gradients, or emoji in UI copy.

## Evidence on Hand

- Target mockups: `docs/redesign-goal/` (Mod Library, Environments, Config).
- Earlier screenshots: `assets/screenshots/`.
- No testimonials, user counts, or download statistics exist; do not invent them.

## Product Principles

1. The selected environment is always clear; every action says which environment it touches.
2. Background work is visible but never blocks the user.
3. Risky actions (delete, overwrite, runtime mismatch, failed scans) are named explicitly with the affected object and a way back.
4. Data carries the UI: lists, tables, and inspectors before cards.
5. One vocabulary across screens: the same control looks and behaves the same everywhere.

## Accessibility & Inclusion

- Full keyboard operation of navigation, lists, menus, and dialogs; visible focus.
- Icon-only buttons carry accessible names and tooltips; primary actions never depend on hover.
- `prefers-reduced-motion` respected.
