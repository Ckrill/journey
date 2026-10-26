// Data
import lifeExpectancyData from '../data/life-expectancy.json';

// Types
import type { Sex } from '../types/types';

const { regions, world } = lifeExpectancyData;

// Falls back to world figures without a region, and to the average without a sex.
export const getLifeExpectancyYears = (region?: string, sex?: Sex) =>
  Math.round(
    (regions.find(({ value }) => value === region) ?? world).lifeExpectancy[
      sex ?? 'average'
    ],
  );
