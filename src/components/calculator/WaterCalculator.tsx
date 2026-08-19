import { useId, useState } from 'react';
import type { ActivityLevel, WeightUnit } from '@/lib/creatineFormulas';
import {
  calculateWater,
  formatMl,
  type Climate,
  type HydrationPhase,
  type WaterInput,
  type WaterResult,
} from '@/lib/waterFormulas';
import UnitToggle from './UnitToggle';
import { fill } from './messages';
import type { WaterMessages } from './waterMessages';

interface WaterCalculatorProps {
  messages: WaterMessages;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'very_active',
  'athlete',
];
const PHASES: HydrationPhase[] = ['maintenance', 'loading'];
const CLIMATES: Climate[] = ['temperate', 'hot'];

// Same field styling as CreatineCalculator — this is the site's one input look.
const fieldClass =
  'w-full min-h-[48px] rounded-xl border border-[var(--border-strong)] bg-[var(--surface-card)] px-4 py-3 text-base text-[var(--text-primary)] shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all duration-150 hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-4 focus:ring-brand-500/15 focus:outline-none';

const labelClass = 'mb-2 block text-sm font-semibold text-[var(--text-secondary)]';

export default function WaterCalculator({ messages }: WaterCalculatorProps) {
  const id = useId();
  const [input, setInput] = useState<WaterInput>({
    weight: 75,
    weightUnit: 'kg',
    activityLevel: 'moderate',
    phase: 'maintenance',
    climate: 'temperate',
  });
  const [result, setResult] = useState<WaterResult | null>(null);
  const [error, setError] = useState('');

  // Submit-to-calculate, matching the main calculator. Everything runs here in
  // the browser; no input is ever sent anywhere.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!Number.isFinite(input.weight) || input.weight <= 0) {
      setError(messages.invalidWeight);
      setResult(null);
      return;
    }

    setError('');
    setResult(calculateWater(input));
  }

  const errorId = `${id}-weight-error`;

  const rows = result
    ? [
        {
          label: fill(messages.templates.baseline, { weight: result.weightKg }),
          ml: result.baselineMl,
        },
        { label: messages.results.activity, ml: result.activityMl },
        { label: messages.results.loadingExtra, ml: result.phaseMl },
        { label: messages.results.climateExtra, ml: result.climateMl },
      ].filter((row) => row.ml > 0)
    : [];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor={`${id}-weight`} className={labelClass}>
            {messages.fields.weight}
          </label>
          <div className="flex items-center gap-3">
            <input
              id={`${id}-weight`}
              type="number"
              inputMode="decimal"
              min="20"
              max="300"
              step="0.5"
              value={Number.isFinite(input.weight) ? input.weight : ''}
              onChange={(event) => setInput({ ...input, weight: parseFloat(event.target.value) })}
              className={`flex-1 ${fieldClass}`}
              placeholder={messages.fields.weightPlaceholder}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              required
            />
            <UnitToggle
              value={input.weightUnit}
              onChange={(unit: WeightUnit) => setInput({ ...input, weightUnit: unit })}
            />
          </div>
          {error && (
            <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-activity`} className={labelClass}>
            {messages.fields.activityLevel}
          </label>
          <select
            id={`${id}-activity`}
            value={input.activityLevel}
            onChange={(event) =>
              setInput({ ...input, activityLevel: event.target.value as ActivityLevel })
            }
            className={fieldClass}
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {messages.activity[level]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-phase`} className={labelClass}>
            {messages.fields.phase}
          </label>
          <select
            id={`${id}-phase`}
            value={input.phase}
            onChange={(event) =>
              setInput({ ...input, phase: event.target.value as HydrationPhase })
            }
            className={fieldClass}
          >
            {PHASES.map((phase) => (
              <option key={phase} value={phase}>
                {messages.phases[phase]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-climate`} className={labelClass}>
            {messages.fields.climate}
          </label>
          <select
            id={`${id}-climate`}
            value={input.climate}
            onChange={(event) => setInput({ ...input, climate: event.target.value as Climate })}
            className={fieldClass}
          >
            {CLIMATES.map((climate) => (
              <option key={climate} value={climate}>
                {messages.climates[climate]}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          {messages.button}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-5" aria-live="polite">
          <div className="rounded-2xl border border-[var(--tint-brand-border)] bg-[var(--tint-brand-bg)] p-6 text-center">
            <p className="mb-1 text-sm font-semibold text-[var(--tint-brand-ink)]">
              {messages.results.title}
            </p>
            <p className="text-5xl font-extrabold text-[var(--accent)]">
              {result.liters.toFixed(1)} L
            </p>
            <p className="mt-1 text-lg font-medium text-[var(--tint-brand-ink)]">
              {formatMl(result.totalMl)} ml {messages.results.perDay}
            </p>
            <p className="mt-3 text-sm text-[var(--tint-brand-ink)]">
              ≈ {result.flOz} fl oz · ≈ {result.cups} cups
            </p>
            <p className="mt-1 text-sm text-[var(--tint-brand-ink)]">
              {fill(messages.templates.glasses, { glasses: result.glasses })}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <p className="mb-3 text-sm font-bold text-[var(--text-primary)]">
              {messages.results.breakdown}
            </p>
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="py-2 text-start text-[var(--text-secondary)]">{row.label}</td>
                    <td className="py-2 text-end font-medium text-[var(--text-primary)]">
                      +{formatMl(row.ml)} ml
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-2 text-start font-semibold text-[var(--text-primary)]">
                    {messages.results.subtotal}
                  </td>
                  <td className="pt-2 text-end font-semibold text-[var(--text-primary)]">
                    {formatMl(result.rawMl)} ml
                  </td>
                </tr>
              </tbody>
            </table>

            {/*
              Shown only when a bound actually moved the number, so the user is
              never told the subtotal was adjusted when it was not.
            */}
            {result.adjustment === 'floored' && (
              <p className="mt-3 rounded-lg bg-[var(--surface-sunken)] p-3 text-sm text-[var(--text-secondary)]">
                {messages.templates.floorNote}
              </p>
            )}
            {result.adjustment === 'capped' && (
              <p
                role="note"
                className="mt-3 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
              >
                {fill(messages.templates.capNote, { raw: formatMl(result.rawMl) })}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <p className="mb-1 text-sm font-bold text-[var(--text-primary)]">
              {messages.results.timing}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{messages.results.timingValue}</p>
          </div>
        </div>
      )}
    </div>
  );
}
