import { useId, useState } from 'react';
import { MARK, VIZ, scaleLinear } from './tokens';
import { calcLoadingDose, calcMaintenanceDose } from '@/lib/creatineFormulas';

/**
 * Loading dose across body weight, drawn in the emphasis form: the selected
 * weight carries the brand hue, every other column recedes to gray. One series,
 * so no legend — the title names what is plotted.
 *
 * Maintenance dose is deliberately NOT a second series here. It sits near 3 g at
 * every weight, and pairing a 3 g series with a 25 g series on one axis would
 * flatten it to nothing (a second y-axis to "fix" that is never the answer). It
 * is reported as a stat tile beside the chart instead.
 */

const WEIGHTS = Array.from({ length: 15 }, (_, i) => 50 + i * 5); // 50–120 kg

/*
 * The viewBox is sized close to the rendered card width on desktop so the SVG
 * scales near 1:1. Authoring at 720 and letting it stretch inflated every mark —
 * 24px bars rendered at 36px and 12px axis text at 18px.
 */
const CHART_W = 1040;
const CHART_H = 340;
const PAD = { top: 28, right: 20, bottom: 52, left: 52 };
const PLOT_W = CHART_W - PAD.left - PAD.right;
const PLOT_H = CHART_H - PAD.top - PAD.bottom;

const Y_MAX = 28;
const Y_TICKS = [0, 5, 10, 15, 20, 25];

const y = scaleLinear([0, Y_MAX], [PAD.top + PLOT_H, PAD.top]);

const band = PLOT_W / WEIGHTS.length;
const barWidth = Math.min(MARK.maxBarWidth, band - MARK.barGap);

const loadingFor = (kg: number) => calcLoadingDose(kg, 'monohydrate') ?? 0;

export default function DoseByWeightChart() {
  const id = useId();
  const [selected, setSelected] = useState(75);
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const active = hovered ?? selected;
  const activeLoading = loadingFor(active);
  const activeMaintenance = calcMaintenanceDose(active, 'muscle_growth', 'moderate', 'monohydrate');
  const capped = active * 0.3 > 25;

  return (
    <figure className="m-0">
      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Loading dose by body weight</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              0.3 g per kilogram per day, capped at 25 g. Drag the slider to highlight your weight.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTable((value) => !value)}
            className="shrink-0 rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
            aria-expanded={showTable}
            aria-controls={`${id}-table`}
          >
            {showTable ? 'Show chart' : 'Show table'}
          </button>
        </div>

        {/* Readout — the numbers the chart is about, never gated behind hover. */}
        <div className="grid grid-cols-2 gap-px border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] sm:grid-cols-3">
          <div className="bg-[var(--surface-card)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">Body weight</p>
            <p className="mt-0.5 text-2xl font-bold text-[var(--text-primary)]">
              {active} <span className="text-base font-semibold text-[var(--text-muted)]">kg</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">{Math.round(active * 2.2046)} lb</p>
          </div>
          <div className="bg-[var(--surface-card)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">Loading dose</p>
            <p className="mt-0.5 text-2xl font-bold text-[var(--accent)]">
              {activeLoading} <span className="text-base font-semibold text-[var(--text-muted)]">g/day</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {capped ? 'capped at 25 g' : `4 × ${(activeLoading / 4).toFixed(1)} g`}
            </p>
          </div>
          <div className="col-span-2 bg-[var(--surface-card)] px-5 py-4 sm:col-span-1">
            <p className="text-xs font-medium text-[var(--text-muted)]">Maintenance dose</p>
            <p className="mt-0.5 text-2xl font-bold text-[var(--text-primary)]">
              {activeMaintenance} <span className="text-base font-semibold text-[var(--text-muted)]">g/day</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">once daily, ongoing</p>
          </div>
        </div>

        {showTable ? (
          <div id={`${id}-table`} className="overflow-x-auto p-5 sm:p-6">
            <table className="w-full text-sm tabular-nums">
              <caption className="sr-only">
                Creatine loading dose and maintenance dose by body weight from 50 to 120 kilograms.
              </caption>
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-left">
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">Body weight</th>
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">Loading dose</th>
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {WEIGHTS.map((kg) => (
                  <tr key={kg} className="border-b border-[var(--border-subtle)]">
                    <th scope="row" className="py-2 font-medium text-[var(--text-secondary)]">
                      {kg} kg ({Math.round(kg * 2.2046)} lb)
                    </th>
                    <td className="py-2 text-[var(--text-secondary)]">{loadingFor(kg)} g/day</td>
                    <td className="py-2 text-[var(--text-secondary)]">
                      {calcMaintenanceDose(kg, 'muscle_growth', 'moderate', 'monohydrate')} g/day
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-4">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="h-auto w-full"
              role="img"
              aria-label="Column chart of creatine loading dose by body weight from 50 to 120 kilograms. The dose rises from 15 grams at 50 kilograms and plateaus at the 25 gram cap from about 85 kilograms upward."
            >
              {Y_TICKS.map((tick) => (
                <line
                  key={tick}
                  x1={PAD.left}
                  x2={PAD.left + PLOT_W}
                  y1={y(tick)}
                  y2={y(tick)}
                  style={{ stroke: tick === 0 ? VIZ.axis : VIZ.grid }}
                  strokeWidth={1}
                />
              ))}

              {Y_TICKS.map((tick) => (
                <text
                  key={`y-${tick}`}
                  x={PAD.left - 10}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={12}
                  style={{ fill: VIZ.inkMuted, fontVariantNumeric: 'tabular-nums' }}
                >
                  {tick}
                </text>
              ))}

              <text
                x={PAD.left - 10}
                y={PAD.top - 10}
                textAnchor="end"
                fontSize={11}
                style={{ fill: VIZ.inkMuted }}
              >
                g/day
              </text>

              {WEIGHTS.map((kg, index) => {
                const dose = loadingFor(kg);
                const isActive = kg === active;
                const cx = PAD.left + index * band + band / 2;
                const barX = cx - barWidth / 2;
                const barY = y(dose);
                const barH = y(0) - barY;

                return (
                  <g key={kg}>
                    {/* Rounded data-end, square at the baseline. */}
                    <path
                      d={`M${barX},${y(0)} L${barX},${barY + MARK.barRadius}
                          Q${barX},${barY} ${barX + MARK.barRadius},${barY}
                          L${barX + barWidth - MARK.barRadius},${barY}
                          Q${barX + barWidth},${barY} ${barX + barWidth},${barY + MARK.barRadius}
                          L${barX + barWidth},${y(0)} Z`}
                      style={{ fill: isActive ? VIZ.series1 : VIZ.muted }}
                    />

                    {isActive && (
                      <text
                        x={cx}
                        y={barY - 8}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={700}
                        style={{ fill: VIZ.ink, fontVariantNumeric: 'tabular-nums' }}
                      >
                        {dose} g
                      </text>
                    )}

                    <text
                      x={cx}
                      y={PAD.top + PLOT_H + 20}
                      textAnchor="middle"
                      fontSize={11}
                      style={{ fill: isActive ? VIZ.ink : VIZ.inkMuted }}
                      fontWeight={isActive ? 700 : 400}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {kg}
                    </text>

                    {/* Hit target spans the whole band, well past the 24px bar. */}
                    <rect
                      x={PAD.left + index * band}
                      y={PAD.top}
                      width={band}
                      height={PLOT_H}
                      fill="transparent"
                      onPointerEnter={() => setHovered(kg)}
                      onPointerLeave={() => setHovered(null)}
                      onClick={() => setSelected(kg)}
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                );
              })}

              <text
                x={PAD.left + PLOT_W / 2}
                y={CHART_H - 8}
                textAnchor="middle"
                fontSize={12}
                style={{ fill: VIZ.inkMuted }}
              >
                Body weight (kg)
              </text>
            </svg>
          </div>
        )}

        <div className="border-t border-[var(--border-subtle)] px-5 py-4 sm:px-6">
          <label htmlFor={`${id}-weight`} className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
            Body weight: <span className="font-bold text-[var(--text-primary)]">{selected} kg</span>
          </label>
          <input
            id={`${id}-weight`}
            type="range"
            min={50}
            max={120}
            step={5}
            value={selected}
            onChange={(event) => setSelected(Number(event.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--text-muted)]">
            <span>50 kg</span>
            <span>120 kg</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-[var(--text-muted)]">
        Loading applies 0.3 g/kg/day for 5–7 days, capped at 25 g/day. Maintenance applies
        0.03 g/kg/day against a 3 g floor, shown for a muscle-growth goal at moderate activity.
      </figcaption>
    </figure>
  );
}
