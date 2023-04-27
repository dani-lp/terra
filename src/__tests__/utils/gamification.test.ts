import { expect, test } from 'vitest';
import { getLevelProgression } from '../../utils/gamification';

test('getLevelProgression returns level 1 and the same currentPoints for xpPoints less than 10', () => {
  const { level, currentPoints, upperBound, bottomBound, neededPoints } = getLevelProgression(5);
  expect(level).toBe(1);
  expect(currentPoints).toBe(5);
  expect(upperBound).toBe(10);
  expect(bottomBound).toBe(0);
  expect(neededPoints).toBe(5);
});

test('getLevelProgression correctly calculates level and currentPoints for xpPoints between levels 1 and 10', () => {
  const { level, currentPoints, upperBound, bottomBound, neededPoints } = getLevelProgression(85);
  expect(level).toBe(5);
  expect(currentPoints).toBe(10);
  expect(upperBound).toBe(125);
  expect(bottomBound).toBe(75);
  expect(neededPoints).toBe(40);
});

test.concurrent('getLevelProgression correctly calculates level and currentPoints for xpPoints greater than the maximum for level 10', () => {
  const { level, currentPoints, upperBound, bottomBound, neededPoints } = getLevelProgression(10000);
  expect(level).toBe(10);
  expect(currentPoints).toBe(0);
  expect(upperBound).toBe(0);
  expect(bottomBound).toBe(1305);
  expect(neededPoints).toBe(0);
});

test.concurrent('getLevelProgression returns level 2 and 0 currentPoints for xpPoints equal to 10', () => {
  const { level, currentPoints, upperBound, bottomBound, neededPoints } = getLevelProgression(10);
  expect(level).toBe(2);
  expect(currentPoints).toBe(0);
  expect(upperBound).toBe(25);
  expect(bottomBound).toBe(10);
  expect(neededPoints).toBe(15);
});
