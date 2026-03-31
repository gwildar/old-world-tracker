// Spell types: assailment, conveyance, enchantment, hex, magic-missile, magical-vortex

export const LORES = {
  'battle-magic': {
    name: 'Battle Magic',
    spells: [
      { num: 'S', name: 'Hammerhand', type: 'assailment', cv: '7+' },
      { num: 1, name: 'Fireball', type: 'magic-missile', cv: '8+' },
      { num: 2, name: 'Curse of Arrow Attraction', type: 'hex', cv: '7+' },
      { num: 3, name: 'Pillar of Fire', type: 'magical-vortex', cv: '9+' },
      { num: 4, name: 'Arcane Urgency', type: 'conveyance', cv: '9+' },
      { num: 5, name: 'Oaken Shield', type: 'enchantment', cv: '7+' },
      { num: 6, name: 'Curse of Cowardly Flight', type: 'hex', cv: '8+' },
    ],
  },
  'daemonology': {
    name: 'Daemonology',
    spells: [
      { num: 'S', name: 'The Summoning', type: 'magic-missile', cv: '9+' },
      { num: 1, name: 'Steed of Shadows', type: 'conveyance', cv: '8+' },
      { num: 2, name: 'Gathering Darkness', type: 'hex', cv: '9+' },
      { num: 3, name: 'Daemonic Familiars', type: 'assailment', cv: '8+' },
      { num: 4, name: 'Daemonic Vessel', type: 'enchantment', cv: '9+' },
      { num: 5, name: 'Vortex of Chaos', type: 'magical-vortex', cv: '8+' },
      { num: 6, name: 'Daemonic Vigour', type: 'enchantment', cv: '9+' },
    ],
  },
  'dark-magic': {
    name: 'Dark Magic',
    spells: [
      { num: 'S', name: 'Doombolt', type: 'magic-missile', cv: '8+' },
      { num: 1, name: 'Word of Pain', type: 'hex', cv: '10+' },
      { num: 2, name: 'Stream of Corruption', type: 'assailment', cv: '8+' },
      { num: 3, name: 'Infernal Gateway', type: 'conveyance', cv: '9+' },
      { num: 4, name: 'Phantasmagoria', type: 'magical-vortex', cv: '9+' },
      { num: 5, name: 'Battle Lust', type: 'enchantment', cv: '9+' },
      { num: 6, name: 'Soul Eater', type: 'assailment', cv: '7+' },
    ],
  },
  'elementalism': {
    name: 'Elementalism',
    spells: [
      { num: 'S', name: 'Storm Call', type: 'hex', cv: '7+' },
      { num: 1, name: 'Flaming Sword', type: 'assailment', cv: '7+' },
      { num: 2, name: 'Plague of Rust', type: 'hex', cv: '9+' },
      { num: 3, name: 'Summon Elemental Spirit', type: 'magical-vortex', cv: '9+' },
      { num: 4, name: 'Earthen Ramparts', type: 'enchantment', cv: '9+' },
      { num: 5, name: 'Wind Blast', type: 'magic-missile', cv: '8+' },
      { num: 6, name: 'Travel Mystical Pathway', type: 'conveyance', cv: '10+' },
    ],
  },
  'high-magic': {
    name: 'High Magic',
    spells: [
      { num: 'S', name: 'Drain Magic', type: 'hex', cv: '9+' },
      { num: 1, name: 'Walk Between Worlds', type: 'conveyance', cv: '10+' },
      { num: 2, name: 'Fiery Convocation', type: 'magic-missile', cv: '10+' },
      { num: 3, name: 'Tempest', type: 'magical-vortex', cv: '9+' },
      { num: 4, name: 'Corporeal Unmaking', type: 'assailment', cv: '8+' },
      { num: 5, name: 'Fury of Khaine', type: 'enchantment', cv: '9+' },
      { num: 6, name: 'Shield of Saphery', type: 'enchantment', cv: '8+' },
    ],
  },
  'illusion': {
    name: 'Illusion',
    spells: [
      { num: 'S', name: 'Glittering Robe', type: 'enchantment', cv: '8+' },
      { num: 1, name: 'Mind Razor', type: 'magic-missile', cv: '7+' },
      { num: 2, name: 'Shimmering Dragon', type: 'conveyance', cv: '8+' },
      { num: 3, name: 'Column of Crystal', type: 'magical-vortex', cv: '10+' },
      { num: 4, name: 'Confounding Convocation', type: 'hex', cv: '8+' },
      { num: 5, name: 'Spectral Doppelganger', type: 'assailment', cv: '9+' },
      { num: 6, name: 'Miasmic Mirage', type: 'hex', cv: '10+' },
    ],
  },
  'necromancy': {
    name: 'Necromancy',
    spells: [
      { num: 'S', name: 'The Dwellers Below', type: 'assailment', cv: '7+' },
      { num: 1, name: 'Deathly Cabal', type: 'enchantment', cv: '8+' },
      { num: 2, name: 'Unquiet Spirits', type: 'magic-missile', cv: '8+' },
      { num: 3, name: 'Spiritual Vortex', type: 'magical-vortex', cv: '10+' },
      { num: 4, name: 'Curse of Years', type: 'hex', cv: '9+' },
      { num: 5, name: 'Spectral Steed', type: 'conveyance', cv: '9+' },
      { num: 6, name: 'Spirit Leech', type: 'hex', cv: '8+' },
    ],
  },
  'waaagh-magic': {
    name: 'Waaagh! Magic',
    spells: [
      { num: 'S', name: 'Fist of Gork (or Mork)', type: 'assailment', cv: '8+' },
      { num: 1, name: 'Vindictive Glare', type: 'magic-missile', cv: '8+' },
      { num: 2, name: 'Hand of Mork (or Gork)', type: 'conveyance', cv: '7+' },
      { num: 3, name: "Bad Moon Rizin'", type: 'hex', cv: '10+' },
      { num: 4, name: "Evil Sun Shinin'", type: 'enchantment', cv: '9+' },
      { num: 5, name: "'Ere We Go!", type: 'enchantment', cv: '8+' },
      { num: 6, name: 'Foot of Gork (or Mork)', type: 'magical-vortex', cv: '8+' },
    ],
  },

  // Faction-specific full lores
  'primal-magic': {
    name: 'Lore of Primal Magic',
    faction: 'Beastmen',
    spells: [
      { num: 'S', name: 'Primordial Gloom', type: 'magical-vortex', cv: '9+' },
      { num: 1, name: 'Call of the Wild', type: 'conveyance', cv: '8+' },
      { num: 2, name: 'In the Gloaming Wildwood', type: 'hex', cv: '10+' },
      { num: 3, name: 'Flock of Doom', type: 'assailment', cv: '8+' },
      { num: 4, name: 'Fury of the Beast', type: 'enchantment', cv: '9+' },
      { num: 5, name: 'Strangleroot', type: 'magic-missile', cv: '8+' },
      { num: 6, name: "'Neath The Shaden Wodespan", type: 'magical-vortex', cv: '10+' },
    ],
  },
  'shadowlands': {
    name: 'Lore of the Shadowlands',
    faction: 'Warriors of Chaos',
    spells: [
      { num: 'S', name: 'Maelstrom of Chaos', type: 'magic-missile', cv: '7+' },
      { num: 1, name: 'Blackened Bolts', type: 'magic-missile', cv: '8+' },
      { num: 2, name: 'Veil of Gloom', type: 'enchantment', cv: '9+' },
      { num: 3, name: 'Vortex of Darkness', type: 'magical-vortex', cv: '10+' },
      { num: 4, name: 'Shadowed Assailants', type: 'assailment', cv: '8+' },
      { num: 5, name: 'Crawling Mists', type: 'conveyance', cv: '6+/9+' },
      { num: 6, name: 'Chains of Darkness', type: 'hex', cv: '8+' },
    ],
  },
  'troll-magic': {
    name: 'Lore of Troll Magic',
    faction: 'Orc & Goblin Tribes',
    spells: [
      { num: 'S', name: 'Big Smartz', type: 'enchantment', cv: '8+' },
      { num: 1, name: 'Acidic Bile', type: 'magic-missile', cv: '8+' },
      { num: 2, name: 'Troll Brainz', type: 'hex', cv: '9+' },
      { num: 3, name: 'Ravenous Recourse', type: 'conveyance', cv: '8+' },
      { num: 4, name: 'Foetid Whirlpool', type: 'magical-vortex', cv: '9+' },
      { num: 5, name: 'Torrent of Filth', type: 'assailment', cv: '7+' },
      { num: 6, name: 'Rapid Regeneration', type: 'enchantment', cv: '8+' },
    ],
  },
  'the-wilds': {
    name: 'Lore of the Wilds',
    faction: 'Wood Elves',
    spells: [
      { num: 'S', name: 'Swirling Mists', type: 'enchantment', cv: '8+' },
      { num: 1, name: 'Fury of Athel Loren', type: 'magic-missile', cv: '9+' },
      { num: 2, name: "Ariel's Blessing", type: 'enchantment', cv: '9+' },
      { num: 3, name: 'Spiteful Torrent', type: 'magical-vortex', cv: '10+' },
      { num: 4, name: "Durthu's Wrath", type: 'assailment', cv: '9+' },
      { num: 5, name: 'Hidden Pathways', type: 'conveyance', cv: '8+' },
      { num: 6, name: 'Sapping Blight', type: 'hex', cv: '9+' },
    ],
  },

  // Faction-specific signature spells (not full lores)
  'athel-loren': {
    name: 'Lore of Athel Loren',
    faction: 'Wood Elves',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Tree Singing', type: 'magical-vortex', cv: '7+/9+' },
      { num: 'S', name: 'Forest Walker', type: 'conveyance', cv: '9+' },
      { num: 'S', name: 'Flock of Doom', type: 'magic-missile', cv: '8+' },
    ],
  },
  'beasts': {
    name: 'Lore of Beasts',
    faction: 'Beastmen',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Viletide', type: 'magic-missile', cv: '9+' },
      { num: 'S', name: 'Devolve', type: 'magic-missile', cv: '8+' },
      { num: 'S', name: 'Mantle of Ghorok', type: 'enchantment', cv: '8+' },
    ],
  },
  'chaos': {
    name: 'Lore of Chaos',
    faction: 'Warriors of Chaos',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Winds of Chaos (Undivided)', type: 'hex', cv: '7+/9+' },
      { num: 'S', name: 'Acquiescence (Slaanesh)', type: 'hex', cv: '6+' },
      { num: 'S', name: 'Fleshy Abundance (Nurgle)', type: 'enchantment', cv: '7+' },
      { num: 'S', name: 'Blue Fire (Tzeentch)', type: 'magic-missile', cv: '9+' },
    ],
  },
  'daemons': {
    name: 'Lore of Daemons',
    faction: 'Daemons of Chaos',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Plague Wind (Nurgle)', type: 'magical-vortex', cv: '7+' },
      { num: 'S', name: 'Cacophonic Hymn (Slaanesh)', type: 'hex', cv: '10+' },
      { num: 'S', name: 'Pink Fire (Tzeentch)', type: 'magic-missile', cv: '8+' },
      { num: 'S', name: 'Gift of Mutation (Tzeentch)', type: 'hex', cv: '8+/12+' },
    ],
  },
  'gork': {
    name: 'Lore of Gork',
    faction: 'Orc & Goblin Tribes',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Brain Bursta', type: 'assailment', cv: '9+' },
      { num: 'S', name: 'Gaze of Gork', type: 'magic-missile', cv: '9+' },
    ],
  },
  'mork': {
    name: 'Lore of Mork',
    faction: 'Orc & Goblin Tribes',
    signatureOnly: true,
    spells: [
      { num: 'S', name: "Mork's Curse", type: 'hex', cv: '7+' },
      { num: 'S', name: 'Itchy Nuisance', type: 'hex', cv: '9+' },
    ],
  },
  'hashut': {
    name: 'Lore of Hashut',
    faction: 'Chaos Dwarfs',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Curse of Hashut', type: 'magic-missile', cv: '9+' },
      { num: 'S', name: 'Storm of Ash', type: 'hex', cv: '10+' },
      { num: 'S', name: 'Flames of Hashut', type: 'assailment', cv: '9+' },
    ],
  },
  'lustria': {
    name: 'Lore of Lustria',
    faction: 'Lizardmen',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Apotheosis', type: 'enchantment', cv: '10+/12+' },
      { num: 'S', name: 'Monsoon', type: 'magical-vortex', cv: '8+' },
    ],
  },
  'naggaroth': {
    name: 'Lore of Naggaroth',
    faction: 'Dark Elves',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Cursing Word', type: 'hex', cv: '9+' },
      { num: 'S', name: 'Black Horror', type: 'magical-vortex', cv: '9+' },
    ],
  },
  'nehekhara': {
    name: 'Lore of Nehekhara',
    faction: 'Tomb Kings',
    signatureOnly: true,
    spells: [
      { num: 'S', name: "Djaf's Incantation of Cursed Blades", type: 'enchantment', cv: '7+' },
      { num: 'S', name: "Khsar's Incantation of the Desert Wind", type: 'enchantment', cv: '6+/10+' },
      { num: 'S', name: "Usekhp's Incantation of Desiccation", type: 'hex', cv: '9+' },
    ],
  },
  'saphery': {
    name: 'Lore of Saphery',
    faction: 'High Elves',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Hand of Khaine', type: 'assailment', cv: '7+' },
      { num: 'S', name: 'Courage of Aenarion', type: 'enchantment', cv: '10+' },
      { num: 'S', name: "Vaul's Unmaking", type: 'hex', cv: '11+' },
    ],
  },
  'great-maw': {
    name: 'Lore of the Great Maw',
    faction: 'Ogre Kingdoms',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Toothcracker', type: 'enchantment', cv: '7+/10+' },
      { num: 'S', name: 'Trollguts', type: 'enchantment', cv: '8+/11+' },
    ],
  },
  'horned-rat': {
    name: 'Lore of the Horned Rat',
    faction: 'Skaven',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Skitterleap', type: 'conveyance', cv: '8+' },
      { num: 'S', name: 'Warp Lightning', type: 'magic-missile', cv: '10+' },
      { num: 'S', name: 'Cloud of Corruption', type: 'magical-vortex', cv: '10+' },
    ],
  },
  'the-lady': {
    name: 'Lore of the Lady',
    faction: 'Bretonnia',
    signatureOnly: true,
    spells: [
      { num: 'S', name: "The Lady's Gift", type: 'enchantment', cv: '7+/10+' },
      { num: 'S', name: 'Burning Gaze', type: 'magic-missile', cv: '9+' },
      { num: 'S', name: "The Lady's Wrath", type: 'enchantment', cv: '9+' },
    ],
  },
  'undeath': {
    name: 'Lore of Undeath',
    faction: 'Vampire Counts',
    signatureOnly: true,
    spells: [
      { num: 'S', name: "Vanhal's Danse Macabre", type: 'enchantment', cv: '8+/12+' },
      { num: 'S', name: 'Hellish Vigour', type: 'enchantment', cv: '7+/10+' },
      { num: 'S', name: 'Raise Dead', type: 'enchantment', cv: '10+' },
    ],
  },
  'yang': {
    name: 'Lore of Yang',
    faction: 'Grand Cathay',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Constellation of the Dragon', type: 'magic-missile', cv: '7+/11+' },
      { num: 'S', name: 'Great Bastion', type: 'enchantment', cv: '9+' },
      { num: 'S', name: 'Might of Heaven & Earth', type: 'enchantment', cv: '9+/12+' },
    ],
  },
  'yin': {
    name: 'Lore of Yin',
    faction: 'Grand Cathay',
    signatureOnly: true,
    spells: [
      { num: 'S', name: 'Spirits of Wind & Shadow', type: 'hex', cv: '10+' },
      { num: 'S', name: 'Accursed Mirror', type: 'hex', cv: '9+' },
      { num: 'S', name: 'Ancestral Warriors', type: 'assailment', cv: '7+/11+' },
    ],
  },
}

export function getSpellTypeLabel(type) {
  const labels = {
    'assailment': 'Assailment',
    'conveyance': 'Conveyance',
    'enchantment': 'Enchantment',
    'hex': 'Hex',
    'magic-missile': 'Magic Missile',
    'magical-vortex': 'Magical Vortex',
  }
  return labels[type] || type
}
