import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-extrabold text-white text-lg mb-2">💪 CreatineCalc</p>
            <p className="text-sm text-gray-400">{t('tagline')}</p>
          </div>

          <div>
            <p className="font-semibold text-white mb-3">Calculators</p>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link href={`/${locale}/creatine-hcl-calculator`} className="hover:text-white transition-colors">HCl Calculator</Link></li>
              <li><Link href={`/${locale}/creatine-dosage-by-weight`} className="hover:text-white transition-colors">Dose by Weight</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-white transition-colors">Articles</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t('contact')}</Link></li>
              <li><Link href={`/${locale}/privacy-policy`} className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} CreatineCalc. All rights reserved.</p>
          <p>{t('disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
