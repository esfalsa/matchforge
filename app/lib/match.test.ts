import { expect, test } from 'vitest';
import { Match } from './match';

test('results are the same with the same seed', () => {
  const match1 = new Match({
    home: { name: '', att: 1.1, def: 2.3 },
    away: { name: '', att: 1.7, def: 0.9 },
    seed: 'seed',
    datetime: new Date(),
  });

  const match2 = new Match({
    home: { name: '', att: 1.1, def: 2.3 },
    away: { name: '', att: 1.7, def: 0.9 },
    seed: 'seed',
    datetime: new Date(),
  });

  expect(match1.home).toEqual(match2.home);
  expect(match1.away).toEqual(match2.away);
});
