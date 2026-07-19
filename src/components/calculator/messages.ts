import { useTranslations, type Locale } from '@theme/i18n/utils';
import type { ActivityLevel, CreatineType, GoalType } from '@/lib/creatineFormulas';

/**
 * The calculator is a React island, so it cannot reach into the Astro-side
 * translation dictionary at runtime. Instead the page resolves every string it
 * needs on the server and hands the island a flat, serialisable bundle. Adding a
 * label means adding it here, which keeps the island free of i18n plumbing.
 */
export interface CalculatorMessages {
  fields: Record<'weight' | 'weightPlaceholder' | 'goal' | 'activityLevel' | 'creatineType' | 'loadingPhase', string>;
  goals: Record<GoalType, string>;
  activity: Record<ActivityLevel, string>;
  creatineTypes: Record<CreatineType, string>;
  labels: Record<
    | 'type'
    | 'goal'
    | 'bodyWeight'
    | 'day'
    | 'time'
    | 'dose'
    | 'perDay'
    | 'dailySchedule'
    | 'totalPerDay'
    | 'afterLoading',
    string
  >;
  times: Record<'morning' | 'midday' | 'preWorkout' | 'evening', string>;
  results: Record<
    | 'title'
    | 'maintenanceDose'
    | 'loadingSchedule'
    | 'hydration'
    | 'timing'
    | 'timingValue'
    | 'disclaimer',
    string
  >;
  actions: Record<'copy' | 'copied' | 'download', string>;
  button: string;
  invalidWeight: string;
  /** Templates still containing {dose} / {serving} / {amount} / {liters}. */
  templates: Record<
    'loadingInstruction' | 'maintenanceInstruction' | 'noLoadingInstruction' | 'hydrationValue',
    string
  >;
}

export function buildCalculatorMessages(locale: Locale): CalculatorMessages {
  const t = useTranslations(locale);

  return {
    fields: {
      weight: t('calculator.fields.weight'),
      weightPlaceholder: t('calculator.fields.weightPlaceholder'),
      goal: t('calculator.fields.goal'),
      activityLevel: t('calculator.fields.activityLevel'),
      creatineType: t('calculator.fields.creatineType'),
      loadingPhase: t('calculator.fields.loadingPhase'),
    },
    goals: {
      muscle_growth: t('calculator.goals.muscle_growth'),
      performance: t('calculator.goals.performance'),
      endurance: t('calculator.goals.endurance'),
      general_health: t('calculator.goals.general_health'),
    },
    activity: {
      sedentary: t('calculator.activity.sedentary'),
      light: t('calculator.activity.light'),
      moderate: t('calculator.activity.moderate'),
      very_active: t('calculator.activity.very_active'),
      athlete: t('calculator.activity.athlete'),
    },
    creatineTypes: {
      monohydrate: t('calculator.creatineTypes.monohydrate'),
      hcl: t('calculator.creatineTypes.hcl'),
      micronized: t('calculator.creatineTypes.micronized'),
    },
    labels: {
      type: t('calculator.labels.type'),
      goal: t('calculator.labels.goal'),
      bodyWeight: t('calculator.labels.bodyWeight'),
      day: t('calculator.labels.day'),
      time: t('calculator.labels.time'),
      dose: t('calculator.labels.dose'),
      perDay: t('calculator.labels.perDay'),
      dailySchedule: t('calculator.labels.dailySchedule'),
      totalPerDay: t('calculator.labels.totalPerDay'),
      afterLoading: t('calculator.labels.afterLoading'),
    },
    times: {
      morning: t('calculator.times.morning'),
      midday: t('calculator.times.midday'),
      preWorkout: t('calculator.times.preWorkout'),
      evening: t('calculator.times.evening'),
    },
    results: {
      title: t('calculator.results.title'),
      maintenanceDose: t('calculator.results.maintenanceDose'),
      loadingSchedule: t('calculator.results.loadingSchedule'),
      hydration: t('calculator.results.hydration'),
      timing: t('calculator.results.timing'),
      timingValue: t('calculator.results.timingValue'),
      disclaimer: t('calculator.results.disclaimer'),
    },
    actions: {
      copy: t('common.copyResults'),
      copied: t('common.copied'),
      download: t('common.download'),
    },
    button: t('calculator.button'),
    invalidWeight: t('calculator.invalidWeight'),
    templates: {
      loadingInstruction: t('calculator.results.loadingInstruction'),
      maintenanceInstruction: t('calculator.results.maintenanceInstruction'),
      noLoadingInstruction: t('calculator.results.noLoadingInstruction'),
      hydrationValue: t('calculator.results.hydrationValue'),
    },
  };
}

/** Fill {placeholders} in a template that was resolved server-side. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
