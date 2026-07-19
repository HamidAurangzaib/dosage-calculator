import { useState } from 'react';
import type { CalculatorResult, CreatineType, GoalType } from '@/lib/creatineFormulas';
import DoseRing from './DoseRing';
import { fill, type CalculatorMessages } from './messages';

interface ResultCardProps {
  result: CalculatorResult;
  creatineType: CreatineType;
  goal: GoalType;
  messages: CalculatorMessages;
}

/*
 * Ring ceilings. Each ratio is a value against a stated maximum, so the arc
 * means something specific rather than being decorative:
 *   dose  — 5 g/day, the top of the ISSN maintenance band
 *   water — 4 L/day, a practical upper target
 */
const DOSE_CEILING = 5;
const WATER_CEILING = 4;

export default function ResultCard({ result, creatineType, goal, messages }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const liters = result.waterIntake / 1000;

  const summary = [
    `${messages.results.title}`,
    `${messages.results.maintenanceDose}: ${result.maintenanceDose} g/day`,
    result.loadingDose ? `${messages.results.loadingSchedule}: ${result.loadingDose} g/day × 7` : null,
    `${messages.results.hydration}: ${liters.toFixed(1)} L/day`,
    `${messages.labels.type}: ${messages.creatineTypes[creatineType]}`,
    `${messages.labels.goal}: ${messages.goals[goal]}`,
    `${messages.labels.bodyWeight}: ${result.weightInKg} kg`,
  ]
    .filter(Boolean)
    .join('\n');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard permission denied — the values stay on screen regardless. */
    }
  }

  function handleDownload() {
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'creatine-plan.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="surface-raised overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] px-6 py-4">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{messages.results.title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
        <DoseRing
          ratio={result.maintenanceDose / DOSE_CEILING}
          value={result.maintenanceDose}
          unit="g / day"
          label={messages.results.maintenanceDose}
          caption={messages.labels.perDay}
          color="var(--viz-series-1)"
        />
        <DoseRing
          ratio={liters / WATER_CEILING}
          value={liters}
          unit="litres / day"
          label={messages.results.hydration}
          caption={fill(messages.templates.hydrationValue, {
            amount: result.waterIntake,
            liters: liters.toFixed(1),
          })}
          color="var(--viz-series-2)"
        />
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-[var(--border-subtle)] bg-[var(--border-subtle)]">
        {[
          { term: messages.labels.type, detail: messages.creatineTypes[creatineType] },
          { term: messages.labels.goal, detail: messages.goals[goal] },
          { term: messages.labels.bodyWeight, detail: `${result.weightInKg} kg` },
          { term: messages.results.timing, detail: messages.results.timingValue },
        ].map((row) => (
          <div key={row.term} className="bg-[var(--surface-card)] px-5 py-3.5">
            <dt className="text-xs font-medium text-[var(--text-muted)]">{row.term}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">{row.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] px-6 py-4">
        <button type="button" onClick={handleCopy} className="btn-ghost border border-[var(--border-subtle)]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2m-6-4h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
          {copied ? messages.actions.copied : messages.actions.copy}
        </button>

        <button type="button" onClick={handleDownload} className="btn-ghost border border-[var(--border-subtle)]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
          </svg>
          {messages.actions.download}
        </button>
      </div>
    </div>
  );
}
