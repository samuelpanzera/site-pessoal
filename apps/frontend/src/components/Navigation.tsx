import React from 'react';

interface NavigationProps {
  onAccessClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onAccessClick }) => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md h-16 flex items-center px-6">
      <div className="flex-1 font-space-grotesk font-bold text-xl tracking-tighter">
        DEV<span className="text-primary-container">_</span>VOID
      </div>
      <div className="flex gap-8 text-sm font-medium text-on-surface-variant">
        <a href="#" className="text-on-surface hover:text-primary transition-colors">Início</a>
        <a href="#" className="hover:text-primary transition-colors">Projetos</a>
        <a href="#" className="hover:text-primary transition-colors">Contato</a>
      </div>
      <div className="flex-1 flex justify-end">
        <button 
          onClick={onAccessClick}
          className="px-4 py-2 rounded-md border border-primary-container text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all border-glow"
        >
          PDI Access
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
