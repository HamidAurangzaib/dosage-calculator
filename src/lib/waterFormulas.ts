import { toKg, type ActivityLevel, type WeightUnit } from '@/lib/creatineFormulas';

/**
 * Daily water intake estimate for someone supplementing with creatine.
 *
 * Unlike the creatine dose, this is NOT a published formula. There is no ISSN
 * water equation, so the figure is assembled from transparent components and
 * presented as an estimate with a floor and a cap:
 *
 *   - 35 ml/kg/day is a standard adult hydration estimate, in line with the
 *     National Academies adequate-intake figures for total water.
 *   - The activity additions approximate ACSM fluid-replacement guidance for
 *     sweat losses, which scale with training volume.
 *   - The loading addition reflects creatine's cell-volumising effect: loading
 *     at 20-25 g/day draws more water into muscle than a 3-5 g maintenance
 *     dose (ISSN position stand, Kreider et al., 2017).
 *
 * The component breakdown is returned alongside the total on purpose — the page
 * shows the user how the number was built rather than asserting it.
 */

export type HydrationPhase = 'maintenance' | 'loading';
export type Climate = 'temperate' | 'hot';

export interface WaterInput {
  weight: number;
  weightUnit: WeightUnit;
  activityLevel: ActivityLevel;
  phase: HydrationPhase;
  climate: Climate;
}

/** Which safety bound, if any, changed the raw figure. */
export type WaterAdjustment = 'floored' | 'capped' | null;

export interface WaterResult {
  weightKg: number;
  baselineMl: number;
  activityMl: number;
  phaseMl: number;
  climateMl: number;
  /** Sum of the components, before the floor and cap are applied. */
  rawMl: number;
  totalMl: number;
  adjustment: WaterAdjustment;
  liters: number;
  flOz: number;
  cups: number;
  glasses: number;
}

/** ml/kg/day baseline for an adult. */
export const BASELINE_ML_PER_KG = 35;

/**
 * Safety bounds.
 *
 * The floor matches the 2.5 L/day minimum the rest of the site already gives
 * anyone supplementing. The cap exists because more is not better: drinking far
 * past thirst risks hyponatremia, so the tool refuses to recommend beyond 4.5 L
 * and says why instead of scaling indefinitely with body weight.
 */
export const FLOOR_ML = 2500;
export const CAP_ML = 4500;

export const ACTIVITY_ML: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 250,
  moderate: 500,
  very_active: 750,
  athlete: 1000,
};

export const PHASE_ML: Record<HydrationPhase, number> = {
  maintenance: 0,
  loading: 500,
};

export const CLIMATE_ML: Record<Climate, number> = {
  temperate: 0,
  hot: 500,
};

const ML_PER_FL_OZ = 29.5735;
const ML_PER_CUP = 236.588;
const ML_PER_GLASS = 250;

export function calculateWater(input: WaterInput): WaterResult {
  // Reuses the creatine calculator's converter so the site has exactly one
  // lbs -> kg definition rather than two that could drift apart.
  const weightKg = toKg(input.weight, input.weightUnit);

  const baselineMl = Math.round(BASELINE_ML_PER_KG * weightKg);
  const activityMl = ACTIVITY_ML[input.activityLevel];
  const phaseMl = PHASE_ML[input.phase];
  const climateMl = CLIMATE_ML[input.climate];

  const rawMl = baselineMl + activityMl + phaseMl + climateMl;
  const totalMl = Math.min(Math.max(rawMl, FLOOR_ML), CAP_ML);

  const adjustment: WaterAdjustment =
    rawMl < FLOOR_ML ? 'floored' : rawMl > CAP_ML ? 'capped' : null;

  return {
    weightKg: parseFloat(weightKg.toFixed(1)),
    baselineMl,
    activityMl,
    phaseMl,
    climateMl,
    rawMl,
    totalMl,
    adjustment,
    liters: parseFloat((totalMl / 1000).toFixed(1)),
    flOz: Math.round(totalMl / ML_PER_FL_OZ),
    // Nearest half cup — a cup is a coarse kitchen measure, and reporting it to
    // two decimals would imply precision the underlying estimate does not have.
    cups: Math.round((totalMl / ML_PER_CUP) * 2) / 2,
    glasses: Math.round(totalMl / ML_PER_GLASS),
  };
}

/** Thousands-separated ml, e.g. 2950 -> "2,950". */
export function formatMl(ml: number): string {
  return ml.toLocaleString('en-US');
}
