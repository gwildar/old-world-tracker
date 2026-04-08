# units.js Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce `units.js` size by hoisting shared fields out of crewed unit profiles into a `shared` block, splitting equipment per profile, and abbreviating `troopType` values.

**Architecture:** A migration script does the mechanical transformation (shared field extraction + troopType abbreviation). Manual equipment attribution passes then split the per-profile equipment for all 88 crewed units. A single code change in `from-owb.js` resolves the new format at parse time — all other consumers are unchanged.

**Tech Stack:** Vitest, Vite, vanilla JS (ES modules)

---

## File Map

| File | Change |
|---|---|
| `src/parsers/from-owb.js` | Extract + update `resolveUnitEntry` at line 187 |
| `src/data/units.js` | Full rewrite via migration script, then manual equipment edits |
| `src/test/unit-stats-resolution.test.js` | New test file for `resolveUnitEntry` |
| `scripts/migrate-units.mjs` | One-time migration script (delete after use) |

---

## Task 1: Export `resolveUnitEntry` and add tests

**Files:**
- Modify: `src/parsers/from-owb.js:185-190`
- Create: `src/test/unit-stats-resolution.test.js`

- [ ] **Step 1.1: Create the test file**

```js
// src/test/unit-stats-resolution.test.js
import { describe, it, expect } from "vitest";
import { resolveUnitEntry } from "../parsers/from-owb.js";

describe("resolveUnitEntry", () => {
  it("returns array unchanged for non-crewed units", () => {
    const entry = [{ Name: "Swordsman", A: "1", rules: ["Close Order"] }];
    expect(resolveUnitEntry(entry)).toBe(entry);
  });

  it("merges shared fields into each profile for crewed units", () => {
    const entry = {
      shared: {
        crewed: true,
        rules: ["Close Order", "Impact Hits (D6+1)"],
        troopType: ["HCh"],
        magic: [],
        optionalRules: ["Mark of Khorne"],
      },
      stats: [
        { Name: "Chariot", A: "-", equipment: [] },
        { Name: "Crew", A: "1", equipment: ["Hand weapons"] },
      ],
    };
    const resolved = resolveUnitEntry(entry);
    expect(resolved).toHaveLength(2);
    expect(resolved[0]).toMatchObject({
      crewed: true,
      rules: ["Close Order", "Impact Hits (D6+1)"],
      troopType: ["HCh"],
      Name: "Chariot",
      equipment: [],
    });
    expect(resolved[1]).toMatchObject({
      crewed: true,
      rules: ["Close Order", "Impact Hits (D6+1)"],
      Name: "Crew",
      equipment: ["Hand weapons"],
    });
  });

  it("per-profile equipment overrides shared (spread order)", () => {
    const entry = {
      shared: {
        crewed: true,
        rules: ["Skirmishers"],
        troopType: ["WM"],
        magic: [],
        optionalRules: [],
      },
      stats: [
        { Name: "Cannon", A: "-", equipment: ["Cannon"] },
        { Name: "Crew", A: "3", equipment: ["hand weapons", "light armour"] },
      ],
    };
    const resolved = resolveUnitEntry(entry);
    expect(resolved[0].equipment).toEqual(["Cannon"]);
    expect(resolved[1].equipment).toEqual(["hand weapons", "light armour"]);
  });
});
```

- [ ] **Step 1.2: Run tests to confirm new test file fails**

```bash
npm test -- unit-stats-resolution
```

Expected: FAIL — `resolveUnitEntry` is not exported from `from-owb.js`

- [ ] **Step 1.3: Export `resolveUnitEntry` from `from-owb.js` and update its call site**

In `src/parsers/from-owb.js`, add this export before the existing parser function (near the top, after imports):

```js
export function resolveUnitEntry(entry) {
  if (Array.isArray(entry)) return entry;
  return entry.stats.map((s) => ({ ...entry.shared, ...s }));
}
```

Then update lines 185–190 (the `UNIT_STATS[key]` lookup block):

```js
    for (const key of keyToTry) {
      if (key && UNIT_STATS[key]) {
        stats = resolveUnitEntry(UNIT_STATS[key]);
        break;
      }
    }
```

- [ ] **Step 1.4: Run tests to confirm they pass**

```bash
npm test
```

Expected: all tests pass (95 green + 3 new)

- [ ] **Step 1.5: Commit**

```bash
git add src/parsers/from-owb.js src/test/unit-stats-resolution.test.js
git commit -m "feat: add resolveUnitEntry to handle crewed unit shared fields"
```

---

## Task 2: Write and run migration script

This script rewrites `units.js` in one pass: crewed units get the `{ shared, stats }` structure, and all `troopType` values are abbreviated. Equipment stays per-profile (duplicated for now — Task 3–5 fix attribution).

**Files:**
- Create: `scripts/migrate-units.mjs`
- Modify: `src/data/units.js` (full rewrite by script)

- [ ] **Step 2.1: Create the scripts directory and migration script**

```bash
mkdir scripts
```

```js
// scripts/migrate-units.mjs
import { UNIT_STATS } from '../src/data/units.js';
import { writeFileSync } from 'fs';

// Patterns ordered longest-first to prevent partial matches (e.g. "Character" inside "Named Character")
const TROOP_PATTERNS = [
  ['Named Character', 'NCh'],
  ['Monstrous Infantry', 'MI'],
  ['Monstrous Cavalry', 'MCa'],
  ['Monstrous Creature', 'MCr'],
  ['Regular Infantry', 'RI'],
  ['Heavy Infantry', 'HI'],
  ['Light Cavalry', 'LC'],
  ['Heavy Cavalry', 'HC'],
  ['Heavy Chariot', 'HCh'],
  ['Light Chariot', 'LCh'],
  ['War Machine', 'WM'],
  ['War Beast', 'WB'],
  ['Behemoth', 'Be'],
  ['Character', 'Ch'],
  ['Swarm', 'Sw'],
];

function abbreviateTroopType(type) {
  const abbrs = [];
  let remaining = type;
  while (remaining.length > 0) {
    let matched = false;
    for (const [full, abbr] of TROOP_PATTERNS) {
      if (remaining.startsWith(full)) {
        abbrs.push(abbr);
        remaining = remaining.slice(full.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Unknown token — preserve as-is (one char at a time to avoid infinite loop)
      abbrs.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }
  return abbrs;
}

function abbreviateTroopTypes(types) {
  const result = [];
  for (const t of types) {
    result.push(...abbreviateTroopType(t));
  }
  return result;
}

function isCrewedUnit(entry) {
  if (!Array.isArray(entry) || entry.length < 2) return false;
  const first = entry[0];
  return first.crewed === true || first.A === '-';
}

function transformEntry(entry) {
  if (!isCrewedUnit(entry)) {
    // Non-crewed: just abbreviate troopType in each profile
    return entry.map((p) => ({
      ...p,
      troopType: abbreviateTroopTypes(p.troopType ?? []),
    }));
  }

  const first = entry[0];
  const shared = {
    crewed: true,
    rules: first.rules,
    troopType: abbreviateTroopTypes(first.troopType ?? []),
    magic: first.magic,
    optionalRules: first.optionalRules,
  };

  // Strip shared fields from each profile; keep stats + Name + equipment
  const stats = entry.map(({ crewed, rules, troopType, magic, optionalRules, ...rest }) => rest);

  return { shared, stats };
}

const transformed = {};
for (const [key, entry] of Object.entries(UNIT_STATS)) {
  transformed[key] = transformEntry(entry);
}

const output = `export const UNIT_STATS = ${JSON.stringify(transformed, null, 2)};\n`;
writeFileSync('./src/data/units.js', output);

const crewedCount = Object.values(transformed).filter((e) => !Array.isArray(e)).length;
console.log(`Done. Migrated ${crewedCount} crewed units. troopType abbreviated throughout.`);
console.log('Run npm test to verify.');
```

- [ ] **Step 2.2: Run the migration script**

```bash
node scripts/migrate-units.mjs
```

Expected output:
```
Done. Migrated 88 crewed units. troopType abbreviated throughout.
Run npm test to verify.
```

- [ ] **Step 2.3: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests pass. If any fail, check that `resolveUnitEntry` is being called correctly in `from-owb.js` — the script output is valid JS but JSON-stringified (double-quoted keys, no trailing commas), which is valid ES module syntax.

- [ ] **Step 2.4: Verify spot-check of migrated output**

Open `src/data/units.js` and find `"chaos-chariot"`. It should look like:

```json
"chaos-chariot": {
  "shared": {
    "crewed": true,
    "rules": ["Close Order", "Ensorcelled Weapons", "First Charge", "Impact Hits (D6+1)", "Mark of Chaos Undivided"],
    "troopType": ["HCh"],
    "magic": [],
    "optionalRules": ["Mark of Khorne", "Mark of Nurgle", "Mark of Slaanesh", "Mark of Tzeentch"]
  },
  "stats": [
    { "Name": "Chariot", "A": "-", "equipment": ["Hand weapons", "halberds", "hand weapon"], ... },
    { "Name": "Chaos Charioteer (x2)", "A": "1", "equipment": ["Hand weapons", "halberds", "hand weapon"], ... },
    { "Name": "Chaos Steed (x2)", "A": "1", "equipment": ["Hand weapons", "halberds", "hand weapon"], ... }
  ]
}
```

Equipment is still duplicated on all profiles — that's expected. Tasks 3–5 fix this.

Also find a non-crewed unit like `"bat-swarms"` and confirm `troopType` is now `["Sw"]`.

- [ ] **Step 2.5: Commit**

```bash
git add src/data/units.js scripts/migrate-units.mjs
git commit -m "feat: migrate crewed units to shared structure, abbreviate troopType"
```

---

## Task 3: Equipment attribution — 2-profile units (52 units)

These units have one vehicle/monster profile and one crew profile. The current equipment array on each profile contains equipment belonging to both. Split it correctly.

**File:** `src/data/units.js`

**General rules:**
- **War machines** (bolt thrower, cannon, mortar, organ gun, etc.): machine profile gets the weapon (`"Cannon"`, `"Bolt thrower"`, etc.); crew profile gets personal weapons (`"hand weapons"`, `"light armour"` if applicable).
- **Monsters with howdah/crew** (Stegadon, Bastiladon, Arachnarok, Kharibdyss, etc.): monster profile gets natural attacks (horns, claws, venom, etc.); crew profile gets their weapons (hand weapons, javelins, bows, etc.).
- **Single-rider vehicles** (Skull Cannon, Blood Throne, Plague Furnace, etc.): vehicle profile gets the weapon/structure; rider profile gets their weapons.
- **Coach/chariot with 1 crew type** (Skeleton Chariot): chariot body gets `[]`; crew gets their weapons.

**2-profile unit list:**
```
ancient-stegadon, anvil-of-doom, arachnarok-spider, bastiladon,
blood-throne-of-khorne, bolt-thrower-dwarfs, border-princes-bombard,
border-princes-mortar, border-princes-organ-gun, cannon-dwarfs,
casket-of-souls, cathayan-grand-cannon, cauldron-of-blood,
cauldron-of-blood-renegade, chariot-of-tzeentch, deathshrieker-rocket-launcher,
doom-diver-catapult, eagle-claw-bolt-thrower, empire-steam-tank,
field-trebuchet, fire-rain-rocket-battery, flame-cannon, goblin-bolt-throwa,
goblin-hewer, goblin-rock-lobber, great-cannon-empire, grudge-thrower,
helblaster-volley-gun, hellcannon, helstorm-rocket-battery,
hobgoblin-bolt-thrower, iron-daemon, kharibdyss, khemrian-warsphinx,
magma-cannon, mortar-empire, organ-gun, plague-furnace,
plague-furnace-renegade, plagueclaw-catapult, reaper-bolt-thrower,
screaming-bell, screaming-bell-renegade, screaming-skull-catapult,
skeleton-chariot, skull-cannon-of-khorne, snotling-pump-wagon,
stegadon, troglodon, war-altar-of-sigmar, war-hydra, warp-lightning-cannon
```

**Examples to follow:**

*ancient-stegadon* — monster + skink crew:
```json
"stats": [
  { "Name": "Ancient Stegadon", "equipment": ["Great horns", "giant bow"], ... },
  { "Name": "Skink Crew (x5)", "equipment": ["Hand weapons", "javelins"], ... }
]
```

*bolt-thrower-dwarfs* — machine + crew:
```json
"stats": [
  { "Name": "Bolt Thrower", "equipment": ["Bolt thrower"], ... },
  { "Name": "Crew", "equipment": ["hand weapons", "light armour"], ... }
]
```

*arachnarok-spider* — spider + goblin crew:
```json
"stats": [
  { "Name": "Arachnarok Spider", "equipment": ["hand weapon", "venom surge"], ... },
  { "Name": "Goblin Crew (x8)", "equipment": ["Hand weapons", "cavalry spears", "shortbows"], ... }
]
```

- [ ] **Step 3.1: Work through all 52 units in `units.js`**

For each unit: search for the key (e.g. `"ancient-stegadon"`), identify which equipment belongs to which profile, update accordingly.

Use the examples above as templates. For ambiguous cases, use the Name field to identify the profile's role (e.g. "Skink Crew" → crew weapons, the monster name → natural attacks).

- [ ] **Step 3.2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3.3: Commit**

```bash
git add src/data/units.js
git commit -m "fix: attribute equipment per profile for 2-profile crewed units"
```

---

## Task 4: Equipment attribution — 3-profile units (28 units)

These are primarily chariots (chariot body + crew + animals) and some multi-component units.

**File:** `src/data/units.js`

**General rules:**
- **Chariots** (chaos-chariot, goblin-wolf-chariot, orc-boar-chariot, etc.): chariot body gets `[]`; crew (charioteer) gets personal weapons (hand weapons, halberds, etc.); animals (horses, wolves, boars, cold ones) get their natural attack (`"hand weapon"`, `"hooves"`, `"tusks"` etc. — these represent the animal's base attack).
- **Other 3-profile units** (black-coach, doomwheel, gnoblar-scraplauncher, etc.): use Name fields to identify roles and attribute accordingly.

**3-profile unit list:**
```
black-coach, black-coach-renegade, black-orc-boar-chariot, bloodwrack-shrine,
chaos-chariot, chieftain's-chariot, chosen-chaos-chariot, cold-one-chariot,
corpse-cart, coven-throne, doomwheel, dreadquake-mortar, dwarf-cart,
empire-war-wagon, exalted-seeker-chariot-of-slaanesh, gnoblar-scraplauncher,
goblin-wolf-chariot, gorebeast-chariot, lion-chariot-of-chrace,
lothern-skycutter, mortis-engine, orc-boar-chariot, scourgerunner-chariot,
seeker-chariot-of-slaanesh, sky-lantern, stonehorn-riders, thundertusk-riders,
tiranoc-chariot
```

**Examples to follow:**

*chaos-chariot* — chariot body + crew + horses:
```json
"stats": [
  { "Name": "Chariot",                  "equipment": [],                            ... },
  { "Name": "Chaos Charioteer (x2)",    "equipment": ["Hand weapons", "halberds"],  ... },
  { "Name": "Chaos Steed (x2)",         "equipment": ["hand weapon"],               ... }
]
```

*black-coach* — coach body + wraith + nightmares:
```json
"stats": [
  { "Name": "Black Coach",      "equipment": [],                  ... },
  { "Name": "Wraith (x1)",      "equipment": ["Spectral scythe"], ... },
  { "Name": "Nightmares (x2)",  "equipment": ["hand weapon"],     ... }
]
```

*lion-chariot-of-chrace* — chariot body + crew + lions:
```json
"stats": [
  { "Name": "Lion Chariot",           "equipment": [],                              ... },
  { "Name": "Lion Charioteer (x2)",   "equipment": ["Hand weapons", "great weapon"], ... },
  { "Name": "White Lions (x2)",       "equipment": ["hand weapon"],                  ... }
]
```

- [ ] **Step 4.1: Work through all 28 units in `units.js`**

Search for each key, identify roles by Name, split equipment per profile.

- [ ] **Step 4.2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4.3: Commit**

```bash
git add src/data/units.js
git commit -m "fix: attribute equipment per profile for 3-profile crewed units"
```

---

## Task 5: Equipment attribution — 4-profile units (8 units)

The most complex units: typically a chariot body + multiple crew types + animals, or a monster with two different crew types.

**File:** `src/data/units.js`

**4-profile unit list:**
```
burning-chariot-of-tzeentch, hellflayer-of-slaanesh, hellflayer-of-slaanesh-renegade,
ironblaster, razorgor-chariot, skeleton-chariots, tomb-guard-chariots, tuskgor-chariot
```

**Approach:** Search each unit in `units.js`, read all 4 Name fields to understand the structure, then split equipment:
- Vehicle/chariot body → `[]`
- Each crew type → their personal weapons
- Each animal type → their natural attack

**Example — tuskgor-chariot** (chariot + crew + tuskgors):

First look up the current combined equipment by searching for `"tuskgor-chariot"` in units.js, then split:
```json
"stats": [
  { "Name": "Chariot",             "equipment": [],                           ... },
  { "Name": "Ungor Crew (x2)",     "equipment": ["Hand weapons"],             ... },
  { "Name": "Tuskgors (x2)",       "equipment": ["hand weapon"],              ... },
  { "Name": "Chaos Hounds (x2)",   "equipment": ["hand weapon"],              ... }
]
```

**Example — ironblaster** (cannon + crew + rhinox):
```json
"stats": [
  { "Name": "Ironblaster",       "equipment": ["Ironblaster cannon"],       ... },
  { "Name": "Ogre Crew",         "equipment": ["hand weapons"],             ... },
  { "Name": "Rhinox",            "equipment": ["hand weapon"],              ... },
  { "Name": "Gnoblar (x1)",      "equipment": ["hand weapon"],              ... }
]
```

- [ ] **Step 5.1: Work through all 8 units in `units.js`**

Search for each key, read the Name fields to understand roles, split equipment.

- [ ] **Step 5.2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5.3: Commit**

```bash
git add src/data/units.js
git commit -m "fix: attribute equipment per profile for 4-profile crewed units"
```

---

## Task 6: Clean up and final verification

- [ ] **Step 6.1: Delete migration script**

```bash
git rm scripts/migrate-units.mjs
rmdir scripts
```

- [ ] **Step 6.2: Run full test suite**

```bash
npm test
```

Expected: all tests pass (98 total — 95 original + 3 from Task 1).

- [ ] **Step 6.3: Check bundle size improvement**

```bash
npm run build
```

Look for the `units.js` chunk size in the build output. It should be smaller than the pre-refactor 615 KB.

- [ ] **Step 6.4: Final commit**

```bash
git add -A
git commit -m "chore: remove migration script after units.js refactor"
```
