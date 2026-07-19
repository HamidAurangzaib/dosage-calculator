/**
 * Chart tokens.
 *
 * The two series hues were validated against the white card surface with the
 * data-viz palette validator: adjacent CVD ΔE 20.1, normal-vision ΔE 21.2, both
 * ≥ 3:1 contrast. Re-run that check before substituting either hue.
 */
/**
 * Colours resolve through CSS custom properties rather than literals, so the
 * charts follow the theme toggle with no JS and no re-render. Applied via the
 * `style` prop — SVG presentation attributes do not accept var().
 *
 * Light and dark steps are declared in global.css and were validated
 * separately against their own surfaces (dark is a selected set, not a flip).
 */
export const VIZ = {
  series1: 'var(--viz-series-1)',
  series2: 'var(--viz-series-2)',
  muted: 'var(--viz-muted)',
  grid: 'var(--viz-grid)',
  axis: 'var(--viz-axis)',
  surface: 'var(--viz-surface)',
  ink: 'var(--text-primary)',
  inkSecondary: 'var(--text-secondary)',
  inkMuted: 'var(--text-muted)',
} as const;

/** Marks are fixed across every chart so the set reads as one system. */
export const MARK = {
  lineWidth: 2,
  markerRadius: 4.5,
  surfaceRing: 2,
  maxBarWidth: 24,
  barGap: 2,
  barRadius: 4,
} as const;

/** Map a value onto a pixel position. */
export function scaleLinear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Straight-segment path through points — no smoothing, so no invented values. */
export function linePath(points: Array<{ x: number; y: number }>): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

/**
 * Muscle creatine saturation as a percentage of the storage ceiling.
 *
 * Baseline sits near 75% of maximum in an omnivorous diet. Both protocols
 * approach the same ceiling — loading just gets there faster, which is the
 * entire point of the chart. Time constants are fitted to the saturation
 * timelines reported in the ISSN position stand: 5–7 days loading, 3–4 weeks
 * unloaded.
 */
export function saturationAt(day: number, loading: boolean): number {
  const baselineGap = 25;
  const tau = loading ? 2.2 : 8;
  return 100 - baselineGap * Math.exp(-day / tau);
}
