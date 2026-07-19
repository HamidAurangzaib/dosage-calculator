import { useEffect, useRef, useState } from 'react';

const EASE_OUT_EXPO = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animates a number from 0 up to `value`.
 *
 * Returns `value` immediately when the user prefers reduced motion, so the
 * figure is never withheld behind an animation that will not run.
 */
export function useCountUp(value: number, decimals = 1, duration = 900): number {
  const [display, setDisplay] = useState(value);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Number((value * EASE_OUT_EXPO(progress)).toFixed(decimals)));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, decimals, duration]);

  return display;
}
