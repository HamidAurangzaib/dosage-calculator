'use client';

import { WeightUnit } from '@/lib/creatineFormulas';

interface UnitToggleProps {
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
      <button
        type="button"
        onClick={() => onChange('kg')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          value === 'kg'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        kg
      </button>
      <button
        type="button"
        onClick={() => onChange('lbs')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          value === 'lbs'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        lbs
      </button>
    </div>
  );
}
