# Contributing

Thanks for contributing to Compass.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

When you want to test the full search experience, run:

```bash
npm run build
npm run preview
```

Pagefind search is generated during the build, so `npm run dev` does not include the final search bundle.

## Common Commands

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run clean
```

## Project Guidelines

- Keep docs content in `src/content/docs`.
- Store article-specific images next to the article `.mdx` file whenever possible.
- Update `src/data/docs.ts` when adding or reorganizing categories.
- Prefer small, focused pull requests.
- Preserve the existing Astro, Tailwind, and MDX patterns unless there is a strong reason to change them.

## Before Opening a PR

- Run `npm run check`.
- Run `npm run build` if your change affects search, routes, metadata, or generated output.
- Verify keyboard behavior and basic accessibility for any interactive UI changes.
- Update `README.md` and `CHANGELOG.md` when the change affects setup, usage, or end-user behavior.
- If contributor workflow changed, update `CONTRIBUTING.md` too.

## Content Notes

Each article should include frontmatter similar to:

```mdx
---
title: "Article Title"
description: "Short summary of the article."
category: "start-here"
order: 1
updatedAt: 2026-06-03
---
```

## Pull Request Notes

- Explain what changed and why.
- Call out any follow-up work or tradeoffs.
- Include screenshots when the change affects UI.
