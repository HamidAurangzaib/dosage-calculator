/**
 * Topic-mapped related articles.
 *
 * Recency alone puts unrelated posts next to each other, so each article names
 * its own neighbours. A slug with no entry simply renders no related section.
 */
export const RELATED_POSTS: Record<string, string[]> = {
  'how-much-creatine-per-day': [
    'creatine-loading-phase-guide',
    'creatine-dosage-for-beginners',
    'how-much-creatine-per-day-by-weight',
  ],
  'creatine-loading-phase-guide': [
    'how-much-creatine-per-day',
    'best-time-to-take-creatine',
    'creatine-dosage-for-beginners',
  ],
  'creatine-for-muscle-growth': [
    'creatine-loading-phase-guide',
    'best-time-to-take-creatine',
    'can-you-mix-creatine-with-protein-powder',
  ],
  'creatine-hcl-vs-monohydrate': [
    'micronized-creatine-vs-monohydrate',
    'creatine-monohydrate-side-effects',
    'how-much-creatine-per-day-by-weight',
  ],
  'creatine-for-women': [
    'how-much-creatine-per-day',
    'creatine-monohydrate-side-effects',
    'how-much-water-on-creatine',
  ],
  'best-time-to-take-creatine': [
    'can-i-take-creatine-before-bed',
    'creatine-loading-phase-guide',
    'how-much-creatine-per-day',
  ],
  'creatine-dosage-for-beginners': [
    'how-much-creatine-per-day',
    'creatine-loading-phase-guide',
    'how-much-water-on-creatine',
    'creatine-monohydrate-side-effects',
  ],
  'creatine-monohydrate-side-effects': [
    'creatine-hcl-vs-monohydrate',
    'micronized-creatine-vs-monohydrate',
    'how-much-water-on-creatine',
  ],
  'how-much-creatine-per-day-by-weight': [
    'how-much-creatine-per-day',
    'creatine-loading-phase-guide',
    'creatine-dosage-for-beginners',
  ],
  'can-i-take-creatine-before-bed': [
    'best-time-to-take-creatine',
    'how-much-water-on-creatine',
    'creatine-dosage-for-beginners',
  ],
  'how-much-water-on-creatine': [
    'creatine-dosage-for-beginners',
    'creatine-monohydrate-side-effects',
    'how-much-creatine-per-day',
  ],
  'micronized-creatine-vs-monohydrate': [
    'creatine-hcl-vs-monohydrate',
    'can-you-mix-creatine-with-protein-powder',
    'creatine-monohydrate-side-effects',
  ],
  'can-you-mix-creatine-with-protein-powder': [
    'micronized-creatine-vs-monohydrate',
    'best-time-to-take-creatine',
    'creatine-for-muscle-growth',
  ],
  'creatine-and-caffeine': [
    'best-time-to-take-creatine',
    'can-you-mix-creatine-with-protein-powder',
    'creatine-dosage-for-beginners',
  ],
  'does-creatine-make-you-gain-weight': [
    'creatine-monohydrate-side-effects',
    'how-much-water-on-creatine',
    'creatine-for-women',
  ],
  'creatine-for-endurance-athletes': [
    'best-time-to-take-creatine',
    'creatine-loading-phase-guide',
    'how-much-water-on-creatine',
  ],
  'creatine-for-brain-cognitive-performance': [
    'how-long-does-creatine-take-to-work',
    'creatine-for-seniors',
    'creatine-monohydrate-side-effects',
  ],
  'creatine-vs-whey-protein': [
    'can-you-mix-creatine-with-protein-powder',
    'how-much-creatine-per-day',
    'creatine-for-muscle-growth',
  ],
  'how-long-does-creatine-take-to-work': [
    'creatine-loading-phase-guide',
    'creatine-dosage-for-beginners',
    'how-much-creatine-per-day',
  ],
  'creatine-for-seniors': [
    'creatine-for-brain-cognitive-performance',
    'creatine-for-women',
    'creatine-monohydrate-side-effects',
  ],
  'creatine-on-rest-days': [
    'best-time-to-take-creatine',
    'how-much-creatine-per-day',
    'should-you-cycle-creatine',
  ],
  'creatine-for-fat-loss': [
    'does-creatine-make-you-gain-weight',
    'creatine-for-women',
    'creatine-for-endurance-athletes',
  ],
  'vegan-creatine': [
    'creatine-for-brain-cognitive-performance',
    'creatine-for-women',
    'how-much-creatine-per-day',
  ],
  'should-you-cycle-creatine': [
    'creatine-on-rest-days',
    'creatine-monohydrate-side-effects',
    'how-long-does-creatine-take-to-work',
  ],
  'creatine-and-alcohol': [
    'creatine-and-caffeine',
    'how-much-water-on-creatine',
    'creatine-monohydrate-side-effects',
  ],
  'best-creatine-for-women': [
    'creatine-for-women',
    'how-much-creatine-per-day',
    'creatine-monohydrate-side-effects',
  ],
};
