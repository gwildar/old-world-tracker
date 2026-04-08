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
