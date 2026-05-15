import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SiOpenai,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiGo,
  SiRust,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface SkillIcon {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SkillProps {
  name: string;
  levelText: string;
  percentage: number;
  icons?: SkillIcon[];
}

const SkillBar: React.FC<SkillProps> = ({ name, levelText, percentage, icons }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-on-surface-variant">
        <span className="flex items-center gap-2">
          {icons && (
            <span className="flex items-center gap-1.5">
              {icons.map(({ icon: Icon, label }) => (
                <Icon key={label} className="text-xl text-primary opacity-75 transition-opacity hover:opacity-100" />
              ))}
            </span>
          )}
          {name}
        </span>
        <span className="text-primary">{levelText}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-container to-primary shadow-[0_0_10px_rgba(221,183,255,0.4)] transition-all duration-1000 ease-out absolute left-0 top-0"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute left-[25%] top-0 w-1 h-full bg-background z-10" />
        <div className="absolute left-[50%] top-0 w-1 h-full bg-background z-10" />
        <div className="absolute left-[75%] top-0 w-1 h-full bg-background z-10" />
      </div>
    </div>
  );
};

const CriteriaPopup = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { t } = useTranslation();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapperRef, () => {
    setIsClicked(false);
    setIsHovered(false);
  });

  const isOpen = isHovered || isClicked;

  return (
    <div
      className="relative inline-block ml-4"
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => setIsClicked(!isClicked)}
        className={`w-6 h-6 rounded-full border border-primary text-primary flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${isOpen ? 'bg-primary text-on-primary' : 'hover:bg-primary hover:text-on-primary'}`}
        aria-label="Skill criteria info"
      >
        ?
      </button>

      {isOpen && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 p-5 rounded-xl bg-surface-container border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-transparent">
          <div className="space-y-4 text-sm font-manrope">
            <div>
              <span className="text-primary font-bold uppercase tracking-wider text-xs">{t('tech_stack.criteria.expert.title')}</span>
              <p className="text-on-surface-variant text-xs mt-1">{t('tech_stack.criteria.expert.desc')}</p>
            </div>
            <div>
              <span className="text-[#adb4d1] font-bold uppercase tracking-wider text-xs">{t('tech_stack.criteria.proficient.title')}</span>
              <p className="text-on-surface-variant text-xs mt-1">{t('tech_stack.criteria.proficient.desc')}</p>
            </div>
            <div>
              <span className="text-[#978d9d] font-bold uppercase tracking-wider text-xs">{t('tech_stack.criteria.intermediate.title')}</span>
              <p className="text-on-surface-variant text-xs mt-1">{t('tech_stack.criteria.intermediate.desc')}</p>
            </div>
            <div>
              <span className="text-[#4c4451] font-bold uppercase tracking-wider text-xs">{t('tech_stack.criteria.learning.title')}</span>
              <p className="text-on-surface-variant text-xs mt-1">{t('tech_stack.criteria.learning.desc')}</p>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-surface-container"></div>
        </div>
      )}
    </div>
  );
}

const TechStack: React.FC = () => {
  const { t } = useTranslation();

  const skills = [
    {
      name: 'IA',
      levelKey: 'expert',
      percentage: 100,
      icons: [{ icon: SiOpenai, label: 'OpenAI' }],
    },
    {
      name: 'Node / TS / JS',
      levelKey: 'expert',
      percentage: 100,
      icons: [
        { icon: SiNodedotjs, label: 'Node.js' },
        { icon: SiTypescript, label: 'TypeScript' },
        { icon: SiJavascript, label: 'JavaScript' },
      ],
    },
    {
      name: 'React',
      levelKey: 'intermediate',
      percentage: 50,
      icons: [{ icon: SiReact, label: 'React' }],
    },
    {
      name: 'Golang',
      levelKey: 'intermediate',
      percentage: 50,
      icons: [{ icon: SiGo, label: 'Go' }],
    },
    {
      name: 'AWS',
      levelKey: 'intermediate',
      percentage: 50,
      icons: [{ icon: FaAws, label: 'AWS' }],
    },
    {
      name: 'Rust',
      levelKey: 'learning',
      percentage: 25,
      icons: [{ icon: SiRust, label: 'Rust' }],
    },
  ];

  return (
    <section className="py-20 md:py-32 px-6 max-w-5xl mx-auto relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-start justify-center pt-8 md:pt-16">
        <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-space-grotesk font-black text-white/[0.03] uppercase tracking-tighter leading-none select-none">
          Skills
        </span>
      </div>

      <div className="text-center mb-16 md:mb-24 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold tracking-tight">
            {t('tech_stack.title_prefix')} <span className="text-primary">{t('tech_stack.title_highlight')}</span>
          </h2>
          <div className="mt-1">
            <CriteriaPopup />
          </div>
        </div>
        <p className="text-on-surface-variant leading-relaxed max-w-2xl mx-auto mt-6 md:mt-10 text-sm md:text-base">
          {t('tech_stack.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 relative z-10">
        {skills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} levelText={t(`tech_stack.criteria.${skill.levelKey}.title`)} percentage={skill.percentage} icons={skill.icons} />
        ))}
      </div>
    </section>
  );
};

export default TechStack;
