# Content Pipeline

This public site does not render the private Markdown vault directly.

The private vault contains summaries, source notes, operating logs, and working research. Public pages must be rewritten as standalone visual notes.

## Flow

1. Select a candidate topic from the private vault.
2. Review source notes and original links.
3. Exclude private logs, inaccessible links, raw files, and copyright-risk material.
4. Rewrite the topic as a public visual note.
5. Add visual structure: tables, timelines, maps, comparison blocks, or slide-like sections.
6. Separate facts, interpretation, uncertainty, and follow-up questions.
7. Add source attribution without republishing full third-party content.
8. Build and verify the Astro site.
9. Deploy to GitHub Pages.

## Public Note Template

Each public note should answer:

- What is the core question?
- Why does it matter?
- What structure helps the reader understand it quickly?
- What are the facts?
- What is interpretation?
- What remains uncertain?
- What should the reader inspect next?

## Guardrails

- Do not export `00-inbox/`.
- Do not export `01-raw/`.
- Do not mirror private `02-wiki/` pages directly.
- Do not publish personal operating logs.
- Do not republish full third-party articles.
- For investing topics, avoid recommendation language.
- Prefer Korean for public content unless a category intentionally uses another language.

## Candidate Metadata

```yaml
title:
description:
category: ai | apple | investing | language | travel
noteType: visual-note | research-note | deck
status: draft | published
featured: false
updated:
confidence: low | medium | high
tags: []
sources:
  - label:
    url:
```
