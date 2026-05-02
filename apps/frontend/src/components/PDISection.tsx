import React from 'react';
import { useTranslation } from 'react-i18next';

interface PDISectionProps {
  onAccessClick: () => void;
}

const PDISection: React.FC<PDISectionProps> = ({ onAccessClick }) => {
  const { t } = useTranslation();

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="relative p-12 md:p-20 rounded-3xl bg-primary-container overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />
        
        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {t('pdi.restricted_area')}
          </div>
          
          <h2 className="text-5xl font-space-grotesk font-bold tracking-tight text-white leading-tight">
            {t('pdi.title')} <br />
            <span className="opacity-60">{t('pdi.title_highlight')}</span>
          </h2>
          
          <p className="text-white/70 text-lg leading-relaxed">
            {t('pdi.description')}
          </p>
          
          <button 
            onClick={onAccessClick}
            className="cursor-pointer flex items-center gap-4 px-8 py-4 rounded-xl bg-white text-primary-container font-bold hover:gap-6 transition-all shadow-xl"
          >
            {t('pdi.authenticate')}
            <span className="text-xl">→</span>
          </button>
        </div>
        
        {/* Large faint icon */}
        <div className="absolute right-12 bottom-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PDISection;
