'use client';

import { useTranslations } from 'next-intl';
import { CalculatorResult, CreatineType, GoalType } from '@/lib/creatineFormulas';

interface ResultCardProps {
  result: CalculatorResult;
  creatineType: CreatineType;
  goal: GoalType;
}

export default function ResultCard({ result, creatineType, goal }: ResultCardProps) {
  const t = useTranslations('calculator.results');

  const creatineLabel: Record<CreatineType, string> = {
    monohydrate: 'Creatine Monohydrate',
    hcl: 'Creatine HCl',
    micronized: 'Micronized Creatine',
  };

  const goalLabel: Record<GoalType, string> = {
    muscle_growth: 'Muscle Growth',
    performance: 'Athletic Performance',
    endurance: 'Endurance',
    general_health: 'General Health',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Main dose */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">{t('maintenanceDose')}</p>
          <p className="text-5xl font-extrabold text-emerald-600">{result.maintenanceDose}g</p>
          <p className="text-sm text-gray-500 mt-1">per day</p>
        </div>

        {/* Water intake */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">{t('hydration')}</p>
          <p className="text-4xl font-extrabold text-blue-600">
            {(result.waterIntake / 1000).toFixed(1)}L
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t('hydrationValue', {
              amount: result.waterIntake,
              liters: (result.waterIntake / 1000).toFixed(1),
            })}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium">Type</span>
          <span>{creatineLabel[creatineType]}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium">Goal</span>
          <span>{goalLabel[goal]}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium">Body Weight</span>
          <span>{result.weightInKg} kg</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium">{t('timing')}</span>
          <span>{t('timingValue')}</span>
        </div>
      </div>
    </div>
  );
}
