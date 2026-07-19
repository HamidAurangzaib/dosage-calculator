import type { WeightUnit } from '@/lib/creatineFormulas';

interface UnitToggleProps {
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}

const UNITS: WeightUnit[] = ['kg', 'lbs'];

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Weight unit"
      className="flex w-fit overflow-hidden rounded-lg border border-[var(--border-strong)]"
    >
      {UNITS.map((unit) => (
        <button
          key={unit}
          type="button"
          onClick={() => onChange(unit)}
          aria-pressed={value === unit}
          className={`min-h-[44px] px-4 py-2 text-sm font-medium transition-colors ${
            value === unit
              ? 'bg-brand-600 text-white'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]'
          }`}
        >
          {unit}
        </button>
      ))}
    </div>
  );
}
