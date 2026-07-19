import { useCountUp } from './useCountUp';

interface DoseRingProps {
  /** 0–1. Drives the arc only; the printed figure is `value`. */
  ratio: number;
  value: number;
  unit: string;
  label: string;
  caption?: string;
  color: string;
  decimals?: number;
}

const SIZE = 132;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A meter, not a chart: one value against its ceiling. The unfilled track is a
 * lighter step of the same ramp rather than a neutral gray, so the state reads
 * across the whole ring.
 */
export default function DoseRing({
  ratio,
  value,
  unit,
  label,
  caption,
  color,
  decimals = 1,
}: DoseRingProps) {
  const animated = useCountUp(value, decimals);
  const clamped = Math.max(0, Math.min(1, ratio));
  const offset = CIRCUMFERENCE * (1 - clamped);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`${label}: ${value} ${unit}`}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            style={{ stroke: color, opacity: 0.16 }}
          />
          {/* Value arc, drawn from 12 o'clock */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{
              stroke: color,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl leading-none font-extrabold tracking-tight"
            style={{ color }}
          >
            {animated.toFixed(decimals)}
          </span>
          <span className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{unit}</span>
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{label}</p>
      {caption && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{caption}</p>}
    </div>
  );
}
