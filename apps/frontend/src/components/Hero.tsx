import React from 'react';
import ArchitectureBackground from './ArchitectureBackground';

const Hero: React.FC = () => {

  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden mb-32">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            System Status: Operational
          </div>
          <h1 className="text-7xl font-space-grotesk font-bold tracking-tight leading-[0.9]">
            Architecting <br />
            <span className="text-primary">Reliable</span> Backends
          </h1>
          <p className="max-w-xl text-lg text-on-surface-variant leading-relaxed">
            Back-end Developer with a passion for high-performance systems and 
            distributed architectures. Crafting the invisible infrastructure 
            that powers the modern web.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-4 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(221,183,255,0.3)]">
              View Projects
            </button>
            <button className="px-8 py-4 rounded-md border border-white/10 hover:border-white/20 transition-all">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
