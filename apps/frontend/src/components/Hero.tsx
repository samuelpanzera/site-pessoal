import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden mb-32">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <p className="text-primary font-space-grotesk tracking-widest uppercase font-bold text-sm">
            Samuel Panzera
          </p>
          <h1 className="text-7xl font-space-grotesk font-bold tracking-tight leading-[0.9]">
            <Trans
              i18nKey="hero.title"
              components={{
                1: <br />,
                2: <span className="text-primary" />
              }}
            />
          </h1>
          <p className="max-w-xl text-lg text-on-surface-variant leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-4 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(221,183,255,0.3)]">
              {t('hero.view_projects')}
            </button>
            <button className="px-8 py-4 rounded-md border border-white/10 hover:border-white/20 transition-all">
              {t('hero.contact_me')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
