# Design: Highlight Magical Banners on Combat Cards

**Date:** 2026-04-09

## Context

Magical banners currently appear in the same muted grey item list as other magic items on the combat card. They deserve visual distinction because they affect the whole unit and are tactically significant (opponent needs to know they exist).

## Design

### Visual treatment

Banners break out of the shared items line onto their own row:

```
BANNER  Razor Standard
Gilded Cuirass, Spelleater Axe
```

- Gold left border (`border-l-2 border-wh-accent`)
- Faint gold background (`bg-wh-accent/8`)
- "BANNER" uppercase micro-label in dimmed gold (`text-wh-accent-dim`)
- Banner name in full gold (`text-wh-accent`)
- No emoji
- Other magic items remain on the existing muted grey line, unchanged
- If a unit has multiple banners, each gets its own banner line

### What counts as a banner

Magic items where `type === "banner"` or `type === "standard"`. Both values are used in `src/data/magic-items.js`.

## Scope

- Change confined to `src/context/combat-weapons.js`
- No data model changes in the army schema
- At entry build time (where `unitName` and `itemNames` are set), add a `bannerNames: []` field containing names of items where `type === "banner" || type === "standard"`, and exclude those names from `itemNames`
- At render time, `r.bannerNames` and `r.itemNames` are already separated — no lookup needed

## Out of scope

- Showing the banner's `effect` text (not shown for any other items)
- Highlighting banners in the setup screen (separate concern)
