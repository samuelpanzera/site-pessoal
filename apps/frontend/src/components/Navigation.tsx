import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lastUpdatedRaw = import.meta.env.VITE_LAST_UPDATED;

  const formattedDate = useMemo(() => {
    if (!lastUpdatedRaw) return '';
    try {
      const date = new Date(lastUpdatedRaw);
      if (isNaN(date.getTime())) return lastUpdatedRaw;
      
      const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
      const formatted = date.toLocaleDateString(locale, {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
      
      return formatted.replace('.', '').toUpperCase();
    } catch (e) {
      return lastUpdatedRaw;
    }
  }, [lastUpdatedRaw, i18n.language]);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md h-16 flex items-center px-6">
      <div className="flex-1 flex items-center gap-4 font-space-grotesk">
        <div className="font-bold text-xl tracking-tighter">
          DEV<span className="text-primary-container">_</span>VOID
        </div>
        {lastUpdatedRaw && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/40 bg-primary-container/5">
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/70">
              {t('footer.last_updated')} {formattedDate}
            </span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-container" />
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-8 text-sm font-medium text-on-surface-variant">
        <a href="#hero" className="text-on-surface hover:text-primary transition-colors">{t('nav.home')}</a>
        <a href="#projetos" className="hover:text-primary transition-colors">{t('nav.projects')}</a>
        <a 
          href="https://linkedin.com/in/samuelpanzera" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          {t('nav.contact')}
          <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
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
