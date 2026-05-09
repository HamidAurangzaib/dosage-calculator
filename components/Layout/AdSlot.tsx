'use client';
import { useEffect, useState } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

export default function AdSlot({ slot, format = 'auto', className }: AdSlotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (ADS_ENABLED) {
      try {
        const w = window as Window & { adsbygoogle?: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch {}
    }
  }, []);

  if (!ADS_ENABLED) return null;
  if (!mounted) return null;

  return (
    <div className={`ad-container my-6 ${className ?? ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
