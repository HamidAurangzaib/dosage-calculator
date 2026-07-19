import type { CalculatorResult } from '@/lib/creatineFormulas';
import { fill, type CalculatorMessages } from './messages';

interface DoseScheduleProps {
  result: CalculatorResult;
  messages: CalculatorMessages;
}

export default function DoseSchedule({ result, messages }: DoseScheduleProps) {
  if (!result.loadingDose) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
        <h3 className="mb-3 text-lg font-bold text-[var(--text-primary)]">{messages.labels.dailySchedule}</h3>
        <div className="flex items-center gap-3 rounded-xl bg-[var(--tint-brand-bg)] p-4">
          <span className="text-3xl font-extrabold text-[var(--accent)]">{result.maintenanceDose}g</span>
          <p className="text-sm text-[var(--text-secondary)]">
            {fill(messages.templates.noLoadingInstruction, { dose: result.maintenanceDose })}
          </p>
        </div>
      </div>
    );
  }

  const servingSize = parseFloat((result.loadingDose / 4).toFixed(1));
  const times = [
    messages.times.morning,
    messages.times.midday,
    messages.times.preWorkout,
    messages.times.evening,
  ];

  // The loading protocol repeats identically for 7 days, so the table shows a
  // single representative day rather than 28 near-identical rows.
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
      <h3 className="mb-4 text-lg font-bold text-[var(--text-primary)]">{messages.results.loadingSchedule}</h3>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        {fill(messages.templates.loadingInstruction, {
          dose: result.loadingDose,
          serving: servingSize,
        })}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--tint-brand-bg)]">
              <th scope="col" className="rounded-s p-2 text-start font-semibold text-[var(--text-secondary)]">
                {messages.labels.day}
              </th>
              <th scope="col" className="p-2 text-start font-semibold text-[var(--text-secondary)]">
                {messages.labels.time}
              </th>
              <th scope="col" className="rounded-e p-2 text-end font-semibold text-[var(--text-secondary)]">
                {messages.labels.dose}
              </th>
            </tr>
          </thead>
          <tbody>
            {times.map((time, index) => (
              <tr key={time} className="border-b border-[var(--border-subtle)]">
                <td className="p-2 text-[var(--text-muted)]">
                  {index === 0 ? `${messages.labels.day} 1–${result.loadingDurationDays}` : ''}
                </td>
                <td className="p-2 text-[var(--text-secondary)]">{time}</td>
                <td className="p-2 text-end font-medium text-[var(--accent)]">{servingSize}g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--surface-sunken)] font-bold">
              <td colSpan={2} className="p-2 text-[var(--text-secondary)]">
                {messages.labels.totalPerDay}
              </td>
              <td className="p-2 text-end text-[var(--accent)]">{result.loadingDose}g</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-4 rounded-lg bg-[var(--tint-brand-bg)] p-3 text-sm text-[var(--tint-brand-ink)]">
        <strong>{messages.labels.afterLoading}</strong>{' '}
        {fill(messages.templates.maintenanceInstruction, { dose: result.maintenanceDose })}
      </p>
    </div>
  );
}
