import { useId, useState } from 'react';
import {
  calculate,
  type ActivityLevel,
  type CalculatorInput,
  type CalculatorResult,
  type CreatineType,
  type GoalType,
  type WeightUnit,
} from '@/lib/creatineFormulas';
import DoseSchedule from './DoseSchedule';
import ResultCard from './ResultCard';
import UnitToggle from './UnitToggle';
import type { CalculatorMessages } from './messages';

interface CreatineCalculatorProps {
  messages: CalculatorMessages;
  defaultCreatineType?: CreatineType;
  focusWeight?: boolean;
}

const GOALS: GoalType[] = ['muscle_growth', 'performance', 'endurance', 'general_health'];
const ACTIVITY_LEVELS: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'very_active',
  'athlete',
];
const CREATINE_TYPES: CreatineType[] = ['monohydrate', 'hcl', 'micronized'];

const fieldClass =
  'w-full min-h-[48px] rounded-xl border border-[var(--border-strong)] bg-[var(--surface-card)] px-4 py-3 text-base text-[var(--text-primary)] shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all duration-150 hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-4 focus:ring-brand-500/15 focus:outline-none';

export default function CreatineCalculator({
  messages,
  defaultCreatineType = 'monohydrate',
  focusWeight = false,
}: CreatineCalculatorProps) {
  const id = useId();
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!Number.isFinite(input.weight) || input.weight <= 0) {
      setError(messages.invalidWeight);
      setResult(null);
      return;
    }

    setError('');
    setResult(calculate(input));
  }

  const errorId = `${id}-weight-error`;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor={`${id}-weight`} className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
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
              onChange={(event) =>
                setInput({ ...input, weight: parseFloat(event.target.value) })
              }
              className={`flex-1 ${fieldClass}`}
              placeholder={messages.fields.weightPlaceholder}
              autoFocus={focusWeight}
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
          <label htmlFor={`${id}-goal`} className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
            {messages.fields.goal}
          </label>
          <select
            id={`${id}-goal`}
            value={input.goal}
            onChange={(event) => setInput({ ...input, goal: event.target.value as GoalType })}
            className={fieldClass}
          >
            {GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {messages.goals[goal]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${id}-activity`}
            className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]"
          >
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

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
            {messages.fields.creatineType}
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CREATINE_TYPES.map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  input.creatineType === type
                    ? 'border-[var(--accent)] bg-[var(--tint-brand-bg)] text-[var(--accent)]'
                    : 'border-[var(--border-strong)] hover:border-[var(--accent)]'
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-creatineType`}
                  value={type}
                  checked={input.creatineType === type}
                  onChange={() => setInput({ ...input, creatineType: type })}
                  className="accent-brand-600"
                />
                <span className="text-sm font-medium">{messages.creatineTypes[type]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* HCl saturates without loading, so the toggle is meaningless for it. */}
        {input.creatineType !== 'hcl' && (
          <div>
            <label className="flex w-fit cursor-pointer items-center gap-3">
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={input.includeLoadingPhase}
                  onChange={(event) =>
                    setInput({ ...input, includeLoadingPhase: event.target.checked })
                  }
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`block h-6 w-11 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/50 peer-focus-visible:ring-offset-2 ${
                    input.includeLoadingPhase ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-[var(--surface-card)] shadow transition-transform ${
                    input.includeLoadingPhase ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                {messages.fields.loadingPhase}
              </span>
            </label>
          </div>
        )}

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          {messages.button}
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <ResultCard
            result={result}
            creatineType={input.creatineType}
            goal={input.goal}
            messages={messages}
          />
          <DoseSchedule result={result} messages={messages} />
          <p className="rounded-lg border border-[var(--tint-caution-border)] bg-[var(--tint-caution-bg)] p-4 text-sm text-[var(--tint-caution-ink)]">
            {messages.results.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
