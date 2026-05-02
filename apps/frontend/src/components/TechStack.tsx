import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
interface SkillProps {
  name: string;
  levelText: string;
  percentage: number;
}

const SkillBar: React.FC<SkillProps> = ({ name, levelText, percentage }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        <span>{name}</span>
        <span className="text-primary">{levelText}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden">
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
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative inline-block ml-4">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        className="w-6 h-6 rounded-full border border-primary text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-help"
        aria-label="Skill criteria info"
      >
        ?
      </button>
      
      {isOpen && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 p-5 rounded-xl bg-surface-container border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
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
    { name: 'IA', levelKey: 'expert', percentage: 100 },
    { name: 'Node / TS / JS', levelKey: 'expert', percentage: 100 },
    { name: 'React', levelKey: 'intermediate', percentage: 50 },
    { name: 'Golang', levelKey: 'intermediate', percentage: 50 },
    { name: 'AWS', levelKey: 'intermediate', percentage: 50 },
    { name: 'Rust', levelKey: 'learning', percentage: 25 },
  ];

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto relative">
      {/* Watermark text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-start justify-center pt-12">
        <span className="text-[6rem] md:text-[10rem] font-space-grotesk font-black text-white/[0.03] uppercase tracking-tighter leading-none">
          Skills
        </span>
      </div>

      <div className="text-center mb-24 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold tracking-tight">
            {t('tech_stack.title_prefix')} <span className="text-primary">{t('tech_stack.title_highlight')}</span>
          </h2>
          <div className="mt-1">
            <CriteriaPopup />
          </div>
        </div>
        <p className="text-on-surface-variant leading-relaxed max-w-2xl mx-auto mt-10">
          {t('tech_stack.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
        {skills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} levelText={t(`tech_stack.criteria.${skill.levelKey}.title`)} percentage={skill.percentage} />
        ))}
      </div>
    </section>
  );
};

export default TechStack;
