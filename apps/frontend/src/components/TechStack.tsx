import React from 'react';

interface SkillProps {
  name: string;
  level: number; // 0 to 100
}

const SkillBar: React.FC<SkillProps> = ({ name, level }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        <span>{name}</span>
        <span>{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-container to-primary shadow-[0_0_10px_rgba(221,183,255,0.4)] transition-all duration-1000 ease-out"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
};

const TechStack: React.FC = () => {
  const skills = [
    { name: 'Golang', level: 90 },
    { name: 'React / TypeScript', level: 85 },
    { name: 'Node.js / Bun', level: 80 },
    { name: 'PostgreSQL', level: 75 },
    { name: 'Docker / K8s', level: 70 },
    { name: 'AWS', level: 65 },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-space-grotesk font-bold tracking-tight">
            Technical <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            I build with a focus on speed and scalability. My stack is chosen for 
            precision, reliability, and the ability to handle complex logic with 
            minimal overhead.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 p-8 rounded-xl bg-surface-container border border-white/5 glow-purple">
          {skills.map((skill) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
