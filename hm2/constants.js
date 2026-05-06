export const LURES = [
  {
    id: 'thrifty_bitz',
    name: 'Thrifty Bitz',
    description: 'Basic food that attracts common cats.',
    cost: 0,
    type: 'food',
    attractionRate: 0.1,
  },
  {
    id: 'frisky_bitz',
    name: 'Frisky Bitz',
    description: 'Better food for more frequent visitors.',
    cost: 30,
    type: 'food',
    attractionRate: 0.3,
  },
  {
    id: 'rubber_ball',
    name: 'Rubber Ball',
    description: 'A simple red ball cats love to bat around.',
    cost: 50,
    type: 'toy',
    attractionRate: 0.2,
  },
  {
    id: 'cardboard_box',
    name: 'Cardboard Box',
    description: 'The ultimate cat attractor.',
    cost: 100,
    type: 'toy',
    attractionRate: 0.5,
  }
];

export const CAT_BREEDS = [
  {
    id: 'calico',
    name: 'Calico',
    description: 'A colorful and curious cat.',
    rarity: 'common',
    colors: {
      body: '#fff',
      patches: ['#f90', '#333'],
    },
    preferredLures: ['thrifty_bitz', 'rubber_ball'],
  },
  {
    id: 'tuxedo',
    name: 'Tuxedo',
    description: 'Dressed for a fancy occasion.',
    rarity: 'common',
    colors: {
      body: '#333',
      patches: ['#fff'],
    },
    preferredLures: ['frisky_bitz', 'cardboard_box'],
  },
  {
    id: 'ginger_tabby',
    name: 'Ginger Tabby',
    description: 'Full of energy and mischief.',
    rarity: 'common',
    colors: {
      body: '#f90',
      patches: ['#d60'],
    },
    preferredLures: ['thrifty_bitz', 'rubber_ball'],
  }
];
