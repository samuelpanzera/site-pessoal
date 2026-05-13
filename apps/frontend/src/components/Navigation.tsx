import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const lastUpdated = import.meta.env.VITE_LAST_UPDATED;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md h-20 flex items-stretch px-6">
      <div className="flex-1 flex flex-col justify-center font-space-grotesk">
        {lastUpdated && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-container" />
            </span>
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/50">
              {lastUpdated}
            </span>
          </div>
        )}
        <div className="font-bold text-xl tracking-tighter">
          DEV<span className="text-primary-container">_</span>VOID
        </div>
      </div>
      <div className="flex items-center gap-8 text-sm font-medium text-on-surface-variant">
        <a href="#" className="text-on-surface hover:text-primary transition-colors">{t('nav.home')}</a>
        <a href="#" className="hover:text-primary transition-colors">{t('nav.projects')}</a>
        <a href="#" className="hover:text-primary transition-colors">{t('nav.contact')}</a>
        <span
          className="flex items-center gap-1.5 opacity-40 cursor-not-allowed select-none"
          title="Em breve"
        >
          {t('nav.blog')}
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/40 px-1 py-px rounded leading-tight">
            SOON
          </span>
        </span>
      </div>
      <div className="flex-1 flex justify-end items-center gap-4">
        <LanguageSwitcher />
        <button
          disabled
          className="cursor-not-allowed px-4 py-2 rounded-md border border-primary-container/30 text-xs font-bold uppercase tracking-widest opacity-50"
        >
          {t('nav.pdi_access')}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
