'use client';

import { useTranslations } from 'next-intl';
import { CalculatorResult } from '@/lib/creatineFormulas';

interface DoseScheduleProps {
  result: CalculatorResult;
}

export default function DoseSchedule({ result }: DoseScheduleProps) {
  const t = useTranslations('calculator.results');

  if (result.loadingDose) {
    const servingSize = parseFloat((result.loadingDose / 4).toFixed(1));
    const times = ['Morning (with breakfast)', 'Midday (with lunch)', 'Pre-workout', 'Evening (with dinner)'];

    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('loadingSchedule')}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('loadingInstruction', { dose: result.loadingDose, serving: servingSize })}
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50">
              <th className="text-left p-2 rounded-l font-semibold text-gray-700">Day</th>
              <th className="text-left p-2 font-semibold text-gray-700">Time</th>
              <th className="text-right p-2 rounded-r font-semibold text-gray-700">Dose</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, day) =>
              times.map((time, i) => (
                <tr key={`${day}-${i}`} className="border-b border-gray-100">
                  <td className="p-2 text-gray-500">{i === 0 ? `Day ${day + 1}` : ''}</td>
                  <td className="p-2 text-gray-700">{time}</td>
                  <td className="p-2 text-right font-medium text-emerald-600">{servingSize}g</td>
                </tr>
              ))
            ).flat().slice(0, 8)}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={2} className="p-2 text-gray-700">Total per day (× 7 days)</td>
              <td className="p-2 text-right text-emerald-700">{result.loadingDose}g</td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
          <strong>After loading (Day 8+):</strong>{' '}
          {t('maintenanceInstruction', { dose: result.maintenanceDose })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Daily Dose Schedule</h3>
      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
        <div className="text-3xl font-extrabold text-emerald-600">{result.maintenanceDose}g</div>
        <div className="text-sm text-gray-700">
          {t('noLoadingInstruction', { dose: result.maintenanceDose })}
        </div>
      </div>
    </div>
  );
}
