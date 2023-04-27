import { expect, test } from 'vitest';
import { getLevelProgression } from '../../utils/gamification';

test('getLevelProgression returns level 1 and the same currentPoints for xpPoints less than 10', () => {
  const { level, currentPoints } = getLevelProgression(5);
  expect(level).toBe(1);
  expect(currentPoints).toBe(5);
});

test('getLevelProgression correctly calculates level and currentPoints for xpPoints between levels 1 and 10', () => {
  const { level, currentPoints } = getLevelProgression(85);
  expect(level).toBe(5);
  expect(currentPoints).toBe(10);
});

test.concurrent('getLevelProgression correctly calculates level and currentPoints for xpPoints greater than the maximum for level 10', () => {
  const { level, currentPoints } = getLevelProgression(10000);
  expect(level).toBe(10);
  expect(currentPoints).toBe(0);
});

test.concurrent('getLevelProgression returns level 2 and 0 currentPoints for xpPoints equal to 10', () => {
  const { level, currentPoints } = getLevelProgression(10);
  expect(level).toBe(2);
  expect(currentPoints).toBe(0);
});
