import { useId, useMemo, useState } from 'react';
import { MARK, VIZ, linePath, saturationAt, scaleLinear } from './tokens';

/**
 * Muscle creatine saturation over 28 days, loading protocol against no loading.
 *
 * Two series, so a legend is always present. End-labels are NOT used: the lines
 * converge at the right edge, and nudging labels apart there would detach them
 * from their lines. Labels ride the curves at day 10 instead, where separation
 * is widest and the comparison is the story.
 */

const DAYS = 28;
/* Sized near the rendered card width so the SVG scales ~1:1 — see DoseByWeightChart. */
const CHART_W = 1040;
const CHART_H = 360;
const PAD = { top: 28, right: 28, bottom: 48, left: 56 };

const PLOT_W = CHART_W - PAD.left - PAD.right;
const PLOT_H = CHART_H - PAD.top - PAD.bottom;

const Y_DOMAIN: [number, number] = [70, 102];
const Y_TICKS = [70, 80, 90, 100];
const X_TICKS = [0, 7, 14, 21, 28];

const x = scaleLinear([0, DAYS], [PAD.left, PAD.left + PLOT_W]);
const y = scaleLinear(Y_DOMAIN, [PAD.top + PLOT_H, PAD.top]);

const SERIES = [
  { key: 'loading', label: 'With loading phase', color: VIZ.series1, loading: true },
  { key: 'noLoading', label: 'Without loading', color: VIZ.series2, loading: false },
] as const;

const points = SERIES.map((series) => ({
  ...series,
  data: Array.from({ length: DAYS + 1 }, (_, day) => ({
    day,
    value: saturationAt(day, series.loading),
    x: x(day),
    y: y(saturationAt(day, series.loading)),
  })),
}));

export default function SaturationChart() {
  const id = useId();
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const tableRows = useMemo(
    () =>
      X_TICKS.map((day) => ({
        day,
        loading: saturationAt(day, true),
        noLoading: saturationAt(day, false),
      })),
    [],
  );

  // Pointer position → nearest day. A band across the full plot height keeps the
  // hit target far larger than the 9px markers.
  function handleMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const day = Math.round(ratio * DAYS);
    setHoverDay(Math.max(0, Math.min(DAYS, day)));
  }

  const active = hoverDay ?? null;

  return (
    <figure className="m-0">
      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Muscle creatine saturation over 28 days
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Both protocols reach the same ceiling. Loading arrives in a week, no-loading in 3–4
              weeks.
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

        {/* Legend — always present for two or more series. */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 pt-4 sm:px-6">
          {SERIES.map((series) => (
            <span key={series.key} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span
                aria-hidden="true"
                className="inline-block h-0.5 w-5 rounded-full"
                style={{ backgroundColor: series.color }}
              />
              {series.label}
            </span>
          ))}
        </div>

        {showTable ? (
          <div id={`${id}-table`} className="overflow-x-auto p-5 sm:p-6">
            <table className="w-full text-sm tabular-nums">
              <caption className="sr-only">
                Muscle creatine saturation percentage by day, with and without a loading phase.
              </caption>
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-left">
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">Day</th>
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">With loading</th>
                  <th scope="col" className="py-2 font-semibold text-[var(--text-secondary)]">Without loading</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.day} className="border-b border-[var(--border-subtle)]">
                    <th scope="row" className="py-2 font-medium text-[var(--text-secondary)]">Day {row.day}</th>
                    <td className="py-2 text-[var(--text-secondary)]">{row.loading.toFixed(1)}%</td>
                    <td className="py-2 text-[var(--text-secondary)]">{row.noLoading.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-4">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="h-auto w-full touch-pan-y"
              role="img"
              aria-label="Line chart comparing muscle creatine saturation with and without a loading phase over 28 days. With loading reaches 99 percent by day 7; without loading reaches 99 percent around day 28."
            >
              {/* Gridlines — solid hairlines, one step off surface. */}
              {Y_TICKS.map((tick) => (
                <line
                  key={tick}
                  x1={PAD.left}
                  x2={PAD.left + PLOT_W}
                  y1={y(tick)}
                  y2={y(tick)}
                  style={{ stroke: VIZ.grid }}
                  strokeWidth={1}
                />
              ))}

              {Y_TICKS.map((tick) => (
                <text
                  key={`label-${tick}`}
                  x={PAD.left - 10}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={12}
                  style={{ fill: VIZ.inkMuted, fontVariantNumeric: 'tabular-nums' }}
                >
                  {tick}%
                </text>
              ))}

              {X_TICKS.map((tick) => (
                <text
                  key={`x-${tick}`}
                  x={x(tick)}
                  y={PAD.top + PLOT_H + 24}
                  textAnchor="middle"
                  fontSize={12}
                  style={{ fill: VIZ.inkMuted, fontVariantNumeric: 'tabular-nums' }}
                >
                  {tick === 0 ? 'Day 0' : tick}
                </text>
              ))}

              {/* Baseline */}
              <line
                x1={PAD.left}
                x2={PAD.left + PLOT_W}
                y1={PAD.top + PLOT_H}
                y2={PAD.top + PLOT_H}
                style={{ stroke: VIZ.axis }}
                strokeWidth={1}
              />

              {/* Crosshair sits under the marks so it never obscures them. */}
              {active !== null && (
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={PAD.top}
                  y2={PAD.top + PLOT_H}
                  style={{ stroke: VIZ.axis }}
                  strokeWidth={1}
                />
              )}

              {points.map((series) => (
                <path
                  key={series.key}
                  d={linePath(series.data)}
                  fill="none"
                  style={{ stroke: series.color }}
                  strokeWidth={MARK.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Direct labels at day 10, where the two curves separate most. */}
              <text
                x={x(10)}
                y={y(saturationAt(10, true)) - 12}
                fontSize={12}
                fontWeight={600}
                style={{ fill: VIZ.inkSecondary }}
              >
                With loading
              </text>
              <text
                x={x(10)}
                y={y(saturationAt(10, false)) + 20}
                fontSize={12}
                fontWeight={600}
                style={{ fill: VIZ.inkSecondary }}
              >
                Without loading
              </text>

              {/* Hover markers carry a surface ring so they stay legible on the line. */}
              {active !== null &&
                points.map((series) => {
                  const point = series.data[active];
                  return (
                    <circle
                      key={`marker-${series.key}`}
                      cx={point.x}
                      cy={point.y}
                      r={MARK.markerRadius}
                      style={{ fill: series.color, stroke: VIZ.surface }}
                      strokeWidth={MARK.surfaceRing}
                    />
                  );
                })}

              {/* Full-plot hit band — pointer targets are never the 9px dots. */}
              <rect
                x={PAD.left}
                y={PAD.top}
                width={PLOT_W}
                height={PLOT_H}
                fill="transparent"
                onPointerMove={handleMove}
                onPointerLeave={() => setHoverDay(null)}
                style={{ cursor: 'crosshair' }}
              />
            </svg>

            {/* Tooltip as text below the plot: readable on touch, and never clipped. */}
            <div
              role="status"
              aria-live="polite"
              className="mt-1 min-h-[2.25rem] px-3 text-sm text-[var(--text-secondary)]"
            >
              {active === null ? (
                <span className="text-[var(--text-muted)]">
                  Hover or drag across the chart to compare any day.
                </span>
              ) : (
                <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
                  <strong className="font-semibold text-[var(--text-primary)]">Day {active}</strong>
                  {points.map((series) => (
                    <span key={series.key} className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: series.color }}
                      />
                      {series.label}:{' '}
                      <strong className="font-semibold text-[var(--text-primary)] tabular-nums">
                        {series.data[active].value.toFixed(1)}%
                      </strong>
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <figcaption className="mt-3 text-sm text-[var(--text-muted)]">
        Saturation modelled from the timelines in the ISSN position stand: 5–7 days at 0.3 g/kg/day,
        or 3–4 weeks at 3–5 g/day. Baseline assumes an omnivorous diet.
      </figcaption>
    </figure>
  );
}
