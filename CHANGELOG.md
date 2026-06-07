# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning when tagged or released.

## [Unreleased]

### Changed
- Moved article table of contents links into the left docs sidebar under the category list and removed the previous in-article tinted panel treatment.
- Added a sticky inline mobile "On this page" dropdown under the main header with a live current-section label, and increased spacing between table of contents items.
- Turned parent landing page article lists into numbered index-style links so sections like `/getting-started` scan more clearly.

## [0.1.4] - 2026-06-07

### Added
- Added a reusable `CodeTabs` MDX component for package manager, framework, and command-variant code examples.
- Added a reusable `FileTree` MDX component for showing repo structure and article-owned file paths.
- Added a reusable `Badge` MDX component for inline status labels like new, beta, required, and deprecated.
- Added a reusable `Table` MDX component for comparisons, reference grids, and compact docs data.
- Added reusable `Card` and `CardGrid` MDX components for related guides, next steps, and grouped destination links.
- Added optional article `relatedLinks` frontmatter so docs pages can render end-of-article recommendation cards.

### Changed
- Added an optional `/rss.xml` feed for recent docs updates using article `updatedAt` metadata.
- Removed an unused fallback favicon asset and aligned the starter docs with the actual branding files in use.
- Simplified shared search and pagination types by dropping unreferenced fields and props.
- Reused a shared sidebar section helper across docs routes and made the header brand label follow `site.config.mjs`.
- Unified small UI labels like category headings, sidebar labels, article meta, and the 404 marker under the same mono sentence-case treatment.
- Matched the standard `Tabs` active state underline to the existing `CodeTabs` treatment.
- Removed article H2 link-copy controls and their related styling.
- Replaced the code copy success checkmark with a tooltip-style copied state.
- Rounded accordion corners and updated step numbers to use circular badges.
- Simplified the `FileTree` presentation by removing its outer card background and border.
- Replaced inline continuation links in starter articles with end-of-article recommendation cards.
- Added optional callout titles with tone-matched heading colors.

## [0.1.3] - 2026-06-05

### Added
- On-page table of contents for article headings, styled as a lightweight docs navigation rail.
- Expanded docs frontmatter support for tags, status, author, edit links, hero images, search opt-out, and redirect aliases.
- Redirect alias generation for docs pages via `redirectFrom` frontmatter.

### Changed
- Fixed the header mobile navigation toggle so the menu opens correctly on small screens and closes after selection.
- Article pages now support optional hero images and "Edit this page" links from frontmatter.
- Hidden docs are excluded from suggested article search prompts and the Pagefind indexed article set.
- Moved article metadata like "Updated" and "Edit this page" below the article panel while keeping previous/next navigation inside the content card.
- Search results now highlight matched terms in titles and excerpts, using Pagefind hit excerpts when available.
- Refined the article table of contents with a flush tinted background panel that extends to the card edges.
- Shifted sidebar and article meta labels to a lighter mono sentence-case styling with stronger light-mode contrast.
- Updated starter docs, README, and contributing guidance to document the new frontmatter workflow.

## [0.1.2] - 2026-06-05

### Added
- Image lightbox expansion with click-to-zoom behavior; click the expanded image or anywhere outside it to zoom out.

### Changed
- Refined article navigation styling with lighter inline links and locally hosted arrow icons.
- Shifted docs and category page layouts to a larger responsive breakpoint so mid-sized screens give the content more room.
- Replaced Manrope with locally hosted Geist Sans and Geist Mono.
- Updated secondary `ButtonLink` styles to use a transparent background with a visible border in light and dark mode.
- Renamed docs article slugs to match titles for `write-your-first-article` and `set-up-compass`.
- Removed animation from previous/next article hover state; article title and icon now turn blue on hover.

## [0.1.1] - 2026-06-05

### Added
- New `Start Here` starter articles for creating articles, publishing Compass, restructuring categories, and branding the docs site.
- Reusable checklist components for interactive task lists inside MDX content.

### Changed
- Simplified the search results dropdown to show article titles with frontmatter-driven description previews.
- Updated starter docs to use interactive checklists for publishing and branding workflows.

## [0.1.0] - 2026-06-04

### Added
- Initial Compass Astro docs theme release.
- MDX-based documentation structure with category-driven navigation.
- Pagefind-powered search for the docs homepage and sidebar.
- Reusable docs components including callouts, tabs, accordions, steps, buttons, and quote blocks.
- Light and dark mode support.
