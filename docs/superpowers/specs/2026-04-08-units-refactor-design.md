# units.js Refactor Design

Date: 2026-04-08

## Problem

`units.js` is 27,916 lines. Two sources of bloat:

1. **Crewed unit duplication** — for all 53 crewed units (chariots, monsters with crew, war machines), every profile in the unit carries identical `rules[]`, `troopType[]`, `magic[]`, and `optionalRules[]`. Equipment is also duplicated and incorrectly lumped into a single flat array mixing monster attacks, crew weapons, and mount attacks.

2. **Verbose troopType strings** — values like `"Regular Infantry"`, `"Heavy Chariot"` are never read by app logic but take up significant space. Compound values like `"Regular InfantryCharacter"` are concatenated without a separator, which is semantically wrong.

## Goals

- Reduce file size
- Fix semantic correctness (equipment attributed to correct profile, troopType meaningful)
- No runtime behaviour changes

---

## Section 1 — Crewed unit data format

### New structure

Non-crewed units: unchanged (flat array of profile objects).

Crewed units change from a flat array to `{ shared, stats }`:

```js
// Before
"chaos-chariot": [
  { crewed: true, Name: "Chariot", rules: [...], equipment: ["Hand weapons", "halberds", "hand weapon"], troopType: ["Heavy Chariot"], magic: [], optionalRules: [...], A: "-", ... },
  { Name: "Chaos Charioteer (x2)", rules: [...], equipment: ["Hand weapons", "halberds", "hand weapon"], troopType: ["Heavy Chariot"], magic: [], optionalRules: [...], A: "1", ... },
  { Name: "Chaos Steed (x2)", rules: [...], equipment: ["Hand weapons", "halberds", "hand weapon"], troopType: ["Heavy Chariot"], magic: [], optionalRules: [...], A: "1", ... },
]

// After
"chaos-chariot": {
  shared: {
    crewed: true,
    rules: ["Close Order", "Ensorcelled Weapons", "First Charge", "Impact Hits (D6+1)", "Mark of Chaos Undivided"],
    troopType: ["HCh"],
    magic: [],
    optionalRules: ["Mark of Khorne", "Mark of Nurgle", "Mark of Slaanesh", "Mark of Tzeentch"]
  },
  stats: [
    { Name: "Chariot",               equipment: [],                            A: "-", S: "5", T: "5", W: "4", BS: "-", Ld: "-", WS: "-", "Impact-Hits": "D6+1" },
    { Name: "Chaos Charioteer (x2)", equipment: ["Hand weapons", "halberds"], A: "1", S: "4", T: "-", W: "-", BS: "3", Ld: "8",  WS: "5" },
    { Name: "Chaos Steed (x2)",      equipment: ["hand weapon"],              A: "1", S: "4", T: "-", W: "-", BS: "-", Ld: "-",  WS: "3", M: "7" },
  ]
}
```

### shared block fields

| Field           | Always in shared | Notes                          |
| --------------- | ---------------- | ------------------------------ |
| `crewed`        | yes              | Unit-level flag                |
| `rules`         | yes              | Identical across all profiles  |
| `troopType`     | yes              | Unit-level classification      |
| `magic`         | yes              | Always identical               |
| `optionalRules` | yes              | Always identical               |
| `equipment`     | no               | Always per-profile (see below) |

### Equipment

Equipment is always per-profile for crewed units. The current flat arrays mix monster natural attacks, crew weapons, and animal attacks — these must be manually attributed to the correct profile for all 53 crewed units.

Examples:

- **Arachnarok Spider**: spider → `["hand weapon", "venom surge"]`; crew → `["Hand weapons", "cavalry spears", "shortbows"]`
- **Bastiladon**: monster → `["Thunderous bludgeon", "Ark of Sotek"]`; crew → `["Hand weapons", "javelins"]`
- **War machines**: machine → its weapon (e.g. `["Bombard"]`); crew → `["hand weapons", "light armour"]`
- **Chariots**: chariot body → `[]`; crew → their weapons; horses/beasts → natural attacks

---

## Section 2 — troopType abbreviation scheme

troopType values are abbreviationed. Compound values (previously concatenated strings) are split into proper arrays.

### Mapping table

| Full value         | Abbreviation |
| ------------------ | ------------ |
| Regular Infantry   | RI           |
| Heavy Infantry     | HI           |
| Light Cavalry      | LC           |
| Heavy Cavalry      | HC           |
| Monstrous Infantry | MI           |
| Monstrous Cavalry  | MCa          |
| Monstrous Creature | MCr          |
| Heavy Chariot      | HCh          |
| Light Chariot      | LCh          |
| War Machine        | WM           |
| War Beast          | WB           |
| Behemoth           | Be           |
| Swarm              | Sw           |
| Character          | Ch           |
| Named Character    | NCh          |

### Compound value splitting

| Before                                       | After                 |
| -------------------------------------------- | --------------------- |
| `["Regular InfantryCharacter"]`              | `["RI", "Ch"]`        |
| `["Heavy InfantryCharacter"]`                | `["HI", "Ch"]`        |
| `["Heavy InfantryNamed Character"]`          | `["HI", "NCh"]`       |
| `["Heavy CavalryNamed Character"]`           | `["HC", "NCh"]`       |
| `["War MachineCharacter"]`                   | `["WM", "Ch"]`        |
| `["BehemothCharacter"]`                      | `["Be", "Ch"]`        |
| `["BehemothNamed Character"]`                | `["Be", "NCh"]`       |
| `["Monstrous InfantryCharacter"]`            | `["MI", "Ch"]`        |
| `["Monstrous CavalryNamed Character"]`       | `["MCa", "NCh"]`      |
| `["Monstrous CreatureCharacter"]`            | `["MCr", "Ch"]`       |
| `["Regular InfantryNamed Character"]`        | `["RI", "NCh"]`       |
| `["Regular InfantryCharacter", "War Beast"]` | `["RI", "Ch", "WB"]`  |
| `["Heavy InfantryBehemothNamed Character"]`  | `["HI", "Be", "NCh"]` |
| `["Named CharacterRegular Infantry"]`        | `["NCh", "RI"]`       |
| `["Named CharacterHeavy Infantry"]`          | `["NCh", "HI"]`       |
| `["Light CavalryCharacter"]`                 | `["LC", "Ch"]`        |
| `["Light CavalryNamed Character"]`           | `["LC", "NCh"]`       |
| `["Heavy CavalryCharacter"]`                 | `["HC", "Ch"]`        |
| `["Heavy ChariotNamed Character"]`           | `["HCh", "NCh"]`      |
| `["Regular InfantryWar Beast"]`              | `["RI", "WB"]`        |

No code changes required — troopType in unit profiles is never read by app logic (confirmed: only `mount.troopType` in `mounts.js` uses a separate lookup with its own abbreviation scheme).

---

## Section 3 — Code changes

### from-owb.js (single change)

`UNIT_STATS[key]` can now return either an array (non-crewed) or `{ shared, stats }` (crewed). Resolution at the single access point (`from-owb.js:187`):

```js
// Before
stats = UNIT_STATS[key];

// After
const entry = UNIT_STATS[key];
stats = Array.isArray(entry)
  ? entry
  : entry.stats.map((s) => ({ ...entry.shared, ...s }));
```

After the spread, each resolved profile contains all `shared` fields plus its own stats and equipment. All existing consumers (`combat-weapons.js`, `helpers.js`, `shooting.js`, `special-rules-context.js`) continue reading `unit.stats[i].rules`, `.equipment`, `.crewed` etc. without any changes.

### Tests

No test changes expected — the resolution is transparent. Existing tests that exercise crewed units via `UNIT_STATS` lookup should pass once the merge is in place. A post-implementation sanity check should confirm all 95 tests remain green.

---

## Section 4 — Semantic fixes

### troopType on crewed units

`troopType` moves to `shared` and reflects the unit as a whole. Crew profiles no longer carry the monster's troopType — they inherit it from `shared` after resolution, which is correct: the unit is classified as a Behemoth/Monstrous Creature/etc., not individual crew members.

### Equipment attribution

The bulk of the manual work. All 53 crewed units need equipment reviewed and split to the correct profile. The current flat arrays conflate weapons from different profiles.

---

## Out of scope

- Non-crewed unit structure changes
- Changes to `mounts.js` or `TROOP_TYPE_RULES`
- Adding troopType logic to app code
- Any display or UI changes
