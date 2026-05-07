import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExperiences, type ExperienceItem } from '../hooks/useExperiences';

type Lang = 'pt' | 'en';

const COLLAPSE_FROM_ORDER = 5;

function getLang(language: string): Lang {
  return language.startsWith('pt') ? 'pt' : 'en';
}

const SkeletonCard: React.FC = () => (
  <div className="relative flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-xl bg-surface-container-high animate-pulse shrink-0" />
      <div className="w-px flex-grow bg-surface-container-high my-2" />
    </div>
    <div className="flex-1 pb-12 space-y-3">
      <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse" />
      <div className="h-4 w-28 bg-surface-container-high rounded animate-pulse" />
      <div className="h-3 w-20 bg-surface-container-high rounded animate-pulse" />
      <div className="h-16 w-full bg-surface-container-high rounded animate-pulse mt-4" />
    </div>
  </div>
);

const LogoAvatar: React.FC<{ logo?: string; company: string }> = ({ logo, company }) => {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={company}
        onError={() => setFailed(true)}
        className="w-14 h-14 rounded-xl object-contain bg-surface-container-high border border-white/5 shrink-0 z-10 p-1"
      />
    );
  }

  return (
    <div className="w-14 h-14 rounded-xl bg-[#18392B] border border-white/5 flex items-center justify-center shrink-0 z-10">
      <span className="text-[#8CB49B] font-bold text-xl font-space-grotesk select-none">
        {company.charAt(0).toLowerCase()}
      </span>
    </div>
  );
};

const ExperienceCard: React.FC<{ item: ExperienceItem; lang: Lang; isLast: boolean }> = ({
  item,
  lang,
  isLast,
}) => (
  <div className="relative flex gap-6 group">
    <div className="flex flex-col items-center">
      <LogoAvatar logo={item.logo} company={item.company} />
      {!isLast && <div className="w-px h-full bg-surface-container-high my-2 flex-grow" />}
    </div>

    <div className="flex-1 pb-12">
      <h3 className="text-2xl font-space-grotesk font-bold text-on-surface">{item.company}</h3>
      <p className="text-lg text-on-surface-variant font-medium mt-1">{item.role[lang]}</p>
      <p className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-bold mt-2">
        {item.period.start} {item.period.end ? `— ${item.period.end}` : '— Present'}
      </p>
      <p className="mt-6 text-on-surface-variant text-sm leading-relaxed">
        {item.description[lang]}
      </p>
    </div>
  </div>
);

const Experience: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { experiences, loading } = useExperiences();
  const lang = getLang(i18n.language);
  const [showAll, setShowAll] = useState(false);

  const visible = experiences.filter((e) => e.order < COLLAPSE_FROM_ORDER);
  const collapsed = experiences.filter((e) => e.order >= COLLAPSE_FROM_ORDER);
  const displayed = showAll ? [...visible, ...collapsed] : visible;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="space-y-4">
        <h2 className="text-4xl font-space-grotesk font-bold tracking-tight">
          {t('experiences.title')}{' '}
          <span className="text-primary-container">{t('experiences.title_highlight')}</span>
        </h2>
        <p className="max-w-xl text-on-surface-variant">{t('experiences.description')}</p>
      </div>

      <div>
        {loading ? (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div>
            {displayed.map((item, idx) => (
              <ExperienceCard
                key={item.id}
                item={item}
                lang={lang}
                isLast={idx === displayed.length - 1 && !(!showAll && collapsed.length > 0)}
              />
            ))}

            {collapsed.length > 0 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer group mt-2"
              >
                <div className="w-14 h-px bg-surface-container-high group-hover:bg-primary/40 transition-colors" />
                <span>{showAll ? t('experiences.show_less') : t('experiences.show_more')}</span>
                <span className="text-base transition-transform duration-300" style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ↓
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
