export type WeightUnit = 'kg' | 'lbs';
export type GoalType = 'muscle_growth' | 'performance' | 'endurance' | 'general_health';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type CreatineType = 'monohydrate' | 'hcl' | 'micronized';

export interface CalculatorInput {
  weight: number;
  weightUnit: WeightUnit;
  goal: GoalType;
  activityLevel: ActivityLevel;
  creatineType: CreatineType;
  includeLoadingPhase: boolean;
}

export interface CalculatorResult {
  maintenanceDose: number;
  loadingDose: number | null;
  loadingDosesPerDay: number | null;
  loadingDurationDays: number;
  dosesPerDay: number;
  dosePerServing: number;
  waterIntake: number;
  weightInKg: number;
}

export function toKg(weight: number, unit: WeightUnit): number {
  return unit === 'lbs' ? weight / 2.2046 : weight;
}

export function calcMaintenanceDose(
  weightKg: number,
  goal: GoalType,
  activityLevel: ActivityLevel,
  creatineType: CreatineType
): number {
  let base = weightKg * 0.03;

  const goalMultiplier: Record<GoalType, number> = {
    general_health: 1.0,
    endurance: 1.0,
    performance: 1.1,
    muscle_growth: 1.15,
  };

  const activityMultiplier: Record<ActivityLevel, number> = {
    sedentary: 0.9,
    light: 1.0,
    moderate: 1.05,
    very_active: 1.1,
    athlete: 1.2,
  };

  base = base * goalMultiplier[goal] * activityMultiplier[activityLevel];

  if (creatineType === 'hcl') {
    base = base * 0.5;
  }

  const minDose = creatineType === 'hcl' ? 1.0 : 3.0;
  const maxDose = creatineType === 'hcl' ? 3.0 : 5.0;

  return Math.min(Math.max(parseFloat(base.toFixed(1)), minDose), maxDose);
}

export function calcLoadingDose(weightKg: number, creatineType: CreatineType): number | null {
  if (creatineType === 'hcl') return null;
  const loading = weightKg * 0.3;
  return Math.min(parseFloat(loading.toFixed(1)), 25);
}

export function calcWaterIntake(maintenanceDose: number): number {
  const baseWater = 2500;
  return baseWater + Math.round((maintenanceDose / 5) * 500);
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const weightKg = toKg(input.weight, input.weightUnit);

  const maintenanceDose = calcMaintenanceDose(
    weightKg,
    input.goal,
    input.activityLevel,
    input.creatineType
  );

  const loadingDose = input.includeLoadingPhase
    ? calcLoadingDose(weightKg, input.creatineType)
    : null;

  return {
    maintenanceDose,
    loadingDose,
    loadingDosesPerDay: loadingDose ? 4 : null,
    loadingDurationDays: 7,
    dosesPerDay: 1,
    dosePerServing: maintenanceDose,
    waterIntake: calcWaterIntake(maintenanceDose),
    weightInKg: parseFloat(weightKg.toFixed(1)),
  };
}
