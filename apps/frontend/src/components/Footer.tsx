import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <div className="font-space-grotesk font-bold text-2xl tracking-tighter">
            DEV<span className="text-primary-container">_</span>VOID
          </div>
          <p className="max-w-sm text-on-surface-variant text-sm leading-relaxed">
            Architecting the future of distributed systems through precision, 
            performance, and minimal overhead. A back-end perspective on 
            software engineering.
          </p>
        </div>
        
        <div className="space-y-6">
          <h5 className="text-xs font-bold uppercase tracking-widest text-white">Navigation</h5>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Projects</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Tech Stack</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Execution Log</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-xs font-bold uppercase tracking-widest text-white">Connectivity</h5>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Email</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-24 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
        <div>&copy; {new Date().getFullYear()} DEV_VOID PORTFOLIO V1.0.0</div>
        <div className="flex gap-8">
          <span>OLED FRIENDLY</span>
          <span>SYSTEM READY</span>
          <span>BUN + GO + REACT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
