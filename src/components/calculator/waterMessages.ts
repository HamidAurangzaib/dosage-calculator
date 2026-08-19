import { useTranslations, type Locale } from '@theme/i18n/utils';
import type { ActivityLevel } from '@/lib/creatineFormulas';
import type { Climate, HydrationPhase } from '@/lib/waterFormulas';

/**
 * Server-resolved strings for the water island, mirroring
 * `buildCalculatorMessages` — the island gets a flat, serialisable bundle and
 * carries no i18n machinery of its own.
 *
 * Weight and activity labels are deliberately pulled from the existing
 * `calculator.*` keys rather than duplicated under `waterCalculator.*`: they
 * are already translated in every active locale, and two copies of "Moderately
 * Active" would drift the first time one is edited.
 */
export interface WaterMessages {
  fields: Record<'weight' | 'weightPlaceholder' | 'activityLevel' | 'phase' | 'climate', string>;
  activity: Record<ActivityLevel, string>;
  phases: Record<HydrationPhase, string>;
  climates: Record<Climate, string>;
  button: string;
  invalidWeight: string;
  results: Record<
    | 'title'
    | 'perDay'
    | 'breakdown'
    | 'activity'
    | 'loadingExtra'
    | 'climateExtra'
    | 'subtotal'
    | 'timing'
    | 'timingValue',
    string
  >;
  /** Templates still holding {glasses} / {weight} / {raw}. */
  templates: Record<'glasses' | 'baseline' | 'floorNote' | 'capNote', string>;
}

export function buildWaterMessages(locale: Locale): WaterMessages {
  const t = useTranslations(locale);

  return {
    fields: {
      weight: t('calculator.fields.weight'),
      weightPlaceholder: t('calculator.fields.weightPlaceholder'),
      activityLevel: t('calculator.fields.activityLevel'),
      phase: t('waterCalculator.fields.phase'),
      climate: t('waterCalculator.fields.climate'),
    },
    activity: {
      sedentary: t('calculator.activity.sedentary'),
      light: t('calculator.activity.light'),
      moderate: t('calculator.activity.moderate'),
      very_active: t('calculator.activity.very_active'),
      athlete: t('calculator.activity.athlete'),
    },
    phases: {
      maintenance: t('waterCalculator.phases.maintenance'),
      loading: t('waterCalculator.phases.loading'),
    },
    climates: {
      temperate: t('waterCalculator.climates.temperate'),
      hot: t('waterCalculator.climates.hot'),
    },
    button: t('waterCalculator.button'),
    invalidWeight: t('calculator.invalidWeight'),
    results: {
      title: t('waterCalculator.results.title'),
      perDay: t('waterCalculator.results.perDay'),
      breakdown: t('waterCalculator.results.breakdown'),
      activity: t('waterCalculator.results.activity'),
      loadingExtra: t('waterCalculator.results.loadingExtra'),
      climateExtra: t('waterCalculator.results.climateExtra'),
      subtotal: t('waterCalculator.results.subtotal'),
      timing: t('waterCalculator.results.timing'),
      timingValue: t('waterCalculator.results.timingValue'),
    },
    templates: {
      glasses: t('waterCalculator.results.glasses'),
      baseline: t('waterCalculator.results.baseline'),
      floorNote: t('waterCalculator.results.floorNote'),
      capNote: t('waterCalculator.results.capNote'),
    },
  };
}
