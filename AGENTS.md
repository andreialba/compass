# Agent Notes

This repository expects small maintenance docs updates alongside product or content changes.

## Default Change Checklist

When making a meaningful change, review these files before finishing:

- `CHANGELOG.md` for user-visible additions, changes, or fixes
- `README.md` when setup, usage, included features, or reusable components changed
- `CONTRIBUTING.md` when contributor workflow or expectations changed

## Docs-Specific Reminders

- If you add a reusable MDX component, register it in `src/components/docs/mdx-components.ts`.
- If you change search behavior, verify both `npm run check` and the relevant docs article such as `src/content/docs/compass-docs/how-search-works/how-search-works.mdx`.
- If you add or rename starter content, check whether homepage suggestions and category ordering still make sense.

## Before Wrapping Up

- Run `npm run check`.
- Update documentation files that are now inaccurate because of the change.
- Mention any docs files intentionally left unchanged when summarizing work.
