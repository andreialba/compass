# Compass

[![Astro 6](https://img.shields.io/badge/Astro-6-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Configured-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MDX](https://img.shields.io/badge/MDX-Content_Collections-000000?style=for-the-badge&logo=mdx&logoColor=white)](https://docs.astro.build/en/guides/integrations-guide/mdx/)
[![License: MIT](https://img.shields.io/badge/License-MIT-84cc16?style=for-the-badge)](./LICENSE)

Compass is a clean Astro documentation theme for product docs, support centers, and internal knowledge bases. It combines MDX content collections, category-driven navigation, Pagefind-powered search, reusable content components, and a polished light/dark UI without pulling in a heavyweight docs framework.

**Preview:** [https://compass-lilac-tau.vercel.app/](https://compass-lilac-tau.vercel.app/)

## Highlights

- Built with Astro 6 and Tailwind CSS 4
- MDX content collections for article authoring
- Parent categories, sub-category pages, and article routes
- Searchable docs landing page and sidebar search powered by Pagefind
- Reusable docs components like callouts, tabs, steps, accordions, buttons, and quotes
- Light and dark mode support
- Shared site config for branding, links, and CTA text
- Sitemap support for production builds
- MIT licensed

## Tech Stack

- `astro`
- `@astrojs/mdx`
- `@astrojs/sitemap`
- `tailwindcss`
- `@tailwindcss/typography`
- `@fontsource-variable/manrope`
- `pagefind`
- `typescript`

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Search is generated during `npm run build`, so use `npm run preview` when you want to test the full search experience locally.

Useful scripts:

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run clean
```

## Theme Setup

The main theme settings live in [site.config.mjs](./site.config.mjs).

Update these before publishing:

- `siteUrl`
- `name`
- `title`
- `description`
- `githubUrl`
- `navCtaLabel`
- `navCtaHref`
- `footerText`

## Writing Docs

Documentation content lives in `src/content/docs`.

Each article is an `.md` or `.mdx` file with frontmatter like this:

```mdx
---
title: "Setting Up Compass"
description: "Start customizing the theme and content structure."
category: "setting-up-compass"
order: 1
updatedAt: 2026-06-03
---

## Add your content here
```

Categories are defined in [src/data/docs.ts](./src/data/docs.ts). That file powers:

- homepage cards
- top-level category organization
- sidebar navigation
- category and article route generation

## Reusable Components

Compass includes MDX-ready components for richer docs pages:

- `Callout`
- `ButtonLink`
- `QuoteBlock`
- `Accordion`
- `Steps`
- `Step`
- `Tabs`

They are registered in [src/components/docs/mdx-components.ts](./src/components/docs/mdx-components.ts) and used automatically in article routes.

If you add your own Astro component, register it there to make it available inside `.mdx` articles.

## Project Structure

```text
.
|-- public/
|   |-- favicon.svg
|   `-- icons/
|-- src/
|   |-- components/
|   |   `-- docs/
|   |-- content/
|   |   `-- docs/
|   |-- data/
|   |   `-- docs.ts
|   |-- layouts/
|   |-- pages/
|   `-- index.css
|-- astro.config.mjs
|-- package.json
|-- site.config.mjs
`-- tsconfig.json
```

## Publishing Notes

- `site.config.mjs` still contains placeholder URLs by default.
- `astro.config.mjs` uses the value from `site.config.mjs` for the canonical site URL.
- `npm run build` generates the static site, sitemap, and Pagefind search bundle.
- If you plan to publish this package, update the package metadata in `package.json`.

## License

[MIT](./LICENSE)
