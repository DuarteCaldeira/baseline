# Baseline

A minimal React starter for small projects, combining a lightweight design system with a reusable component library.

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript (strict mode)
- **Styling** — SCSS Modules
- **Testing** — Vitest + Testing Library
- **Linting** — ESLint (`next/core-web-vitals`)
- **Formatting** — Prettier with `@trivago/prettier-plugin-sort-imports`
- **Package Manager** — pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `pnpm dev`        | Start development server |
| `pnpm build`      | Build for production     |
| `pnpm start`      | Start production server  |
| `pnpm lint`       | Run ESLint               |
| `pnpm format`     | Run Prettier             |
| `pnpm test`       | Run unit tests once      |
| `pnpm test:watch` | Run tests in watch mode  |

## Project Structure

```
src/
  app/              # Next.js App Router pages & layouts
  components/
    ui/             # Reusable UI components (button, input, select, stepper)
    layout/         # Layout primitives (container, stack)
  hooks/            # Shared custom hooks
  styles/
    tokens/         # Design tokens (colors, spacing, typography, radius, shadows)
    theme/          # Light & dark CSS custom properties
    reset.scss      # Minimal browser reset
    globals.scss    # Global styles entry point
  types/            # Shared TypeScript types
  utils/            # Pure utility functions
  index.ts          # Public barrel export
```

## Component Conventions

Each component lives in its own folder:

```
ComponentName/
  ComponentName.tsx          # Component implementation
  ComponentName.module.scss  # SCSS module styles
  ComponentName.test.tsx     # Unit tests
  index.ts                   # Barrel export
```

Props are typed inline or in a dedicated `types.ts` file.  
Use the `cn()` utility from `@/utils/cn` for conditional class merging.

## Styling

SCSS modules are used exclusively — no CSS-in-JS or inline styles.

Design tokens are organised under `src/styles/tokens/` as SCSS variables and are consumed via `@use`. Theme values are exposed as CSS custom properties and toggled via a `data-theme` attribute.

To apply a theme:

```html
<html data-theme="dark"></html>
```

## Path Aliases

`@/*` maps to `./src/*` in both TypeScript and Vitest.
