import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md h-16 flex items-center px-6">
      <div className="flex-1 font-space-grotesk font-bold text-xl tracking-tighter">
        DEV<span className="text-primary-container">_</span>VOID
      </div>
      <div className="flex gap-8 text-sm font-medium text-on-surface-variant">
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
