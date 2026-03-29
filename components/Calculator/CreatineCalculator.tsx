'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CalculatorInput,
  CalculatorResult,
  WeightUnit,
  GoalType,
  ActivityLevel,
  CreatineType,
  calculate,
} from '@/lib/creatineFormulas';
import UnitToggle from './UnitToggle';
import ResultCard from './ResultCard';
import DoseSchedule from './DoseSchedule';

interface CreatineCalculatorProps {
  defaultCreatineType?: CreatineType;
  focusWeight?: boolean;
}

export default function CreatineCalculator({
  defaultCreatineType = 'monohydrate',
  focusWeight = false,
}: CreatineCalculatorProps) {
  const t = useTranslations('calculator');

  const [input, setInput] = useState<CalculatorInput>({
    weight: 75,
    weightUnit: 'kg',
    goal: 'muscle_growth',
    activityLevel: 'moderate',
    creatineType: defaultCreatineType,
    includeLoadingPhase: false,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.weight || input.weight <= 0) {
      setError('Please enter a valid body weight.');
      return;
    }
    setError('');
    setResult(calculate(input));
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Body Weight */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('fields.weight')}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="20"
              max="300"
              step="0.5"
              value={input.weight}
              onChange={(e) => setInput({ ...input, weight: parseFloat(e.target.value) })}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
              placeholder={t('fields.weightPlaceholder')}
              autoFocus={focusWeight}
              required
            />
            <UnitToggle
              value={input.weightUnit}
              onChange={(unit: WeightUnit) => setInput({ ...input, weightUnit: unit })}
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('fields.goal')}
          </label>
          <select
            value={input.goal}
            onChange={(e) => setInput({ ...input, goal: e.target.value as GoalType })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-white"
          >
            <option value="muscle_growth">{t('goals.muscle_growth')}</option>
            <option value="performance">{t('goals.performance')}</option>
            <option value="endurance">{t('goals.endurance')}</option>
            <option value="general_health">{t('goals.general_health')}</option>
          </select>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('fields.activityLevel')}
          </label>
          <select
            value={input.activityLevel}
            onChange={(e) => setInput({ ...input, activityLevel: e.target.value as ActivityLevel })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-white"
          >
            <option value="sedentary">{t('activity.sedentary')}</option>
            <option value="light">{t('activity.light')}</option>
            <option value="moderate">{t('activity.moderate')}</option>
            <option value="very_active">{t('activity.very_active')}</option>
            <option value="athlete">{t('activity.athlete')}</option>
          </select>
        </div>

        {/* Creatine Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('fields.creatineType')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['monohydrate', 'hcl', 'micronized'] as CreatineType[]).map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  input.creatineType === type
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="creatineType"
                  value={type}
                  checked={input.creatineType === type}
                  onChange={() => setInput({ ...input, creatineType: type })}
                  className="accent-emerald-600"
                />
                <span className="text-sm font-medium">{t(`creatineTypes.${type}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Loading Phase Toggle */}
        {input.creatineType !== 'hcl' && (
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={input.includeLoadingPhase}
                  onChange={(e) => setInput({ ...input, includeLoadingPhase: e.target.checked })}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    input.includeLoadingPhase ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    input.includeLoadingPhase ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {t('fields.loadingPhase')}
              </span>
            </label>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-sm"
        >
          {t('button')}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <ResultCard result={result} creatineType={input.creatineType} goal={input.goal} />
          <DoseSchedule result={result} />
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
            {t('results.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}
