import React, { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import GlitchCycleText from './GlitchCycleText';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const glitchWords = useMemo(
    () => t('hero.glitch_words', { returnObjects: true }) as string[],
    [t]
  );

  return (
    <section className="relative min-h-[100svh] flex items-center px-6 overflow-hidden mb-12 md:mb-15">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[2px] bg-primary"></div>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-space-grotesk tracking-[0.2em] md:tracking-[0.25em] uppercase font-bold text-lg md:text-2xl">
              Samuel Panzera
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-space-grotesk font-bold tracking-tight leading-[1.1] md:leading-[0.9]">
            <Trans
              i18nKey="hero.title"
              components={{
                1: <br />,
                2: <span className="text-primary" />,
                3: <GlitchCycleText words={glitchWords} />
              }}
            />
          </h1>
          <p className="max-w-xl text-base md:text-lg text-on-surface-variant leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="#projetos"
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(221,183,255,0.3)] w-full sm:w-auto text-sm md:text-base"
            >
              {t('hero.view_projects')}
            </a>
            <a
              href="https://linkedin.com/in/samuelpanzera"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 rounded-md border border-white/10 hover:border-white/20 transition-all w-full sm:w-auto text-sm md:text-base"
            >
              {t('hero.contact_me')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
