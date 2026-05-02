import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

const BrazilFlag = ({ className }: { className?: string }) => (
  <svg width="1em" height="1em" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className={className} preserveAspectRatio="xMidYMid meet">
    <path fill="#009B3A" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z"></path>
    <path fill="#FEDF01" d="M32.728 18L18 29.124L3.272 18L18 6.875z"></path>
    <circle fill="#002776" cx="17.976" cy="17.924" r="6.458"></circle>
    <path fill="#CBE9D4" d="M12.277 14.887a6.406 6.406 0 0 0-.672 2.023c3.995-.29 9.417 1.891 11.744 4.595c.402-.604.7-1.28.883-2.004c-2.872-2.808-7.917-4.63-11.955-4.614z"></path>
    <path fill="#88C9F9" d="M12 18.233h1v1h-1zm1 2h1v1h-1z"></path>
    <path fill="#55ACEE" d="M15 18.233h1v1h-1zm2 1h1v1h-1zm4 2h1v1h-1zm-3 1h1v1h-1zm3-6h1v1h-1z"></path>
    <path fill="#3B88C3" d="M19 20.233h1v1h-1z"></path>
  </svg>
);

const USFlag = ({ className }: { className?: string }) => (
  <svg width="1em" height="1em" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_us_flag)">
      <rect width="28" height="20" rx="2" fill="white"/>
      <mask id="mask0_us_flag" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
        <rect width="28" height="20" rx="2" fill="white"/>
      </mask>
      <g mask="url(#mask0_us_flag)">
        <path fillRule="evenodd" clipRule="evenodd" d="M28 0H0V1.33333H28V0ZM28 2.66667H0V4H28V2.66667ZM0 5.33333H28V6.66667H0V5.33333ZM28 8H0V9.33333H28V8ZM0 10.6667H28V12H0V10.6667ZM28 13.3333H0V14.6667H28V13.3333ZM0 16H28V17.3333H0V16ZM28 18.6667H0V20H28V18.6667Z" fill="#D02F44"/>
        <rect width="12" height="9.33333" fill="#46467F"/>
        <g filter="url(#filter0_d_us_flag)">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.66665 1.99999C2.66665 2.36818 2.36817 2.66666 1.99998 2.66666C1.63179 2.66666 1.33331 2.36818 1.33331 1.99999C1.33331 1.63181 1.63179 1.33333 1.99998 1.33333C2.36817 1.33333 2.66665 1.63181 2.66665 1.99999ZM5.33331 1.99999C5.33331 2.36818 5.03484 2.66666 4.66665 2.66666C4.29846 2.66666 3.99998 2.36818 3.99998 1.99999C3.99998 1.63181 4.29846 1.33333 4.66665 1.33333C5.03484 1.33333 5.33331 1.63181 5.33331 1.99999ZM7.33331 2.66666C7.7015 2.66666 7.99998 2.36818 7.99998 1.99999C7.99998 1.63181 7.7015 1.33333 7.33331 1.33333C6.96512 1.33333 6.66665 1.63181 6.66665 1.99999C6.66665 2.36818 6.96512 2.66666 7.33331 2.66666ZM10.6666 1.99999C10.6666 2.36818 10.3682 2.66666 9.99998 2.66666C9.63179 2.66666 9.33331 2.36818 9.33331 1.99999C9.33331 1.63181 9.63179 1.33333 9.99998 1.33333C10.3682 1.33333 10.6666 1.63181 10.6666 1.99999ZM3.33331 3.99999C3.7015 3.99999 3.99998 3.70152 3.99998 3.33333C3.99998 2.96514 3.7015 2.66666 3.33331 2.66666C2.96512 2.66666 2.66665 2.96514 2.66665 3.33333C2.66665 3.70152 2.96512 3.99999 3.33331 3.99999ZM6.66665 3.33333C6.66665 3.70152 6.36817 3.99999 5.99998 3.99999C5.63179 3.99999 5.33331 3.70152 5.33331 3.33333C5.33331 2.96514 5.63179 2.66666 5.99998 2.66666C6.36817 2.66666 6.66665 2.96514 6.66665 3.33333ZM8.66665 3.99999C9.03484 3.99999 9.33331 3.70152 9.33331 3.33333C9.33331 2.96514 9.03484 2.66666 8.66665 2.66666C8.29846 2.66666 7.99998 2.96514 7.99998 3.33333C7.99998 3.70152 8.29846 3.99999 8.66665 3.99999ZM10.6666 4.66666C10.6666 5.03485 10.3682 5.33333 9.99998 5.33333C9.63179 5.33333 9.33331 5.03485 9.33331 4.66666C9.33331 4.29847 9.63179 3.99999 9.99998 3.99999C10.3682 3.99999 10.6666 4.29847 10.6666 4.66666ZM7.33331 5.33333C7.7015 5.33333 7.99998 5.03485 7.99998 4.66666C7.99998 4.29847 7.7015 3.99999 7.33331 3.99999C6.96512 3.99999 6.66665 4.29847 6.66665 4.66666C6.66665 5.03485 6.96512 5.33333 7.33331 5.33333ZM5.33331 4.66666C5.33331 5.03485 5.03484 5.33333 4.66665 5.33333C4.29846 5.33333 3.99998 5.03485 3.99998 4.66666C3.99998 4.29847 4.29846 3.99999 4.66665 3.99999C5.03484 3.99999 5.33331 4.29847 5.33331 4.66666ZM1.99998 5.33333C2.36817 5.33333 2.66665 5.03485 2.66665 4.66666C2.66665 4.29847 2.36817 3.99999 1.99998 3.99999C1.63179 3.99999 1.33331 4.29847 1.33331 4.66666C1.33331 5.03485 1.63179 5.33333 1.99998 5.33333ZM3.99998 5.99999C3.99998 6.36819 3.7015 6.66666 3.33331 6.66666C2.96512 6.66666 2.66665 6.36819 2.66665 5.99999C2.66665 5.6318 2.96512 5.33333 3.33331 5.33333C3.7015 5.33333 3.99998 5.6318 3.99998 5.99999ZM5.99998 6.66666C6.36817 6.66666 6.66665 6.36819 6.66665 5.99999C6.66665 5.6318 6.36817 5.33333 5.99998 5.33333C5.63179 5.33333 5.33331 5.6318 5.33331 5.99999C5.33331 6.36819 5.63179 6.66666 5.99998 6.66666ZM9.33331 5.99999C9.33331 6.36819 9.03484 6.66666 8.66665 6.66666C8.29846 6.66666 7.99998 6.36819 7.99998 5.99999C7.99998 5.6318 8.29846 5.33333 8.66665 5.33333C9.03484 5.33333 9.33331 5.6318 9.33331 5.99999ZM9.99998 8C10.3682 8 10.6666 7.70152 10.6666 7.33333C10.6666 6.96514 10.3682 6.66666 9.99998 6.66666C9.63179 6.66666 9.33331 6.96514 9.33331 7.33333C9.33331 7.70152 9.63179 8 9.99998 8ZM7.99998 7.33333C7.99998 7.70152 7.7015 8 7.33331 8C6.96512 8 6.66665 7.70152 6.66665 7.33333C6.66665 6.96514 6.96512 6.66666 7.33331 6.66666C7.7015 6.66666 7.99998 6.96514 7.99998 7.33333ZM4.66665 8C5.03484 8 5.33331 7.70152 5.33331 7.33333C5.33331 6.96514 5.03484 6.66666 4.66665 6.66666C4.29846 6.66666 3.99998 6.96514 3.99998 7.33333C3.99998 7.70152 4.29846 8 4.66665 8ZM2.66665 7.33333C2.66665 7.70152 2.36817 8 1.99998 8C1.63179 8 1.33331 7.70152 1.33331 7.33333C1.33331 6.96514 1.63179 6.66666 1.99998 6.66666C2.36817 6.66666 2.66665 6.96514 2.66665 7.33333Z" fill="url(#paint0_linear_us_flag)"/>
        </g>
      </g>
    </g>
    <defs>
      <filter id="filter0_d_us_flag" x="1.33331" y="1.33333" width="9.33331" height="7.66667" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_us_flag"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_us_flag" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear_us_flag" x1="1.33331" y1="1.33333" x2="1.33331" y2="7.99999" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="#F0F0F0"/>
      </linearGradient>
      <clipPath id="clip0_us_flag">
        <rect width="28" height="20" rx="2" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const languages = [
  { code: 'pt', label: 'BR', name: 'Português', Icon: BrazilFlag },
  { code: 'en', label: 'EN', name: 'English', Icon: USFlag },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Set initial selected lang based on i18n
  const initialLang = languages.find(l => l.code === i18n.language) || languages[0];
  const [selectedLang, setSelectedLang] = useState(initialLang);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update local state if i18n language changes outside this component
    const currentLang = languages.find(l => l.code === i18n.language);
    if (currentLang && currentLang.code !== selectedLang.code) {
      setSelectedLang(currentLang);
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang.code);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, lang?: typeof languages[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (lang) {
        handleSelect(lang);
      } else {
        setIsOpen(!isOpen);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 border rounded-lg bg-black/40 border-white/10 text-white/80 hover:bg-white/5 hover:text-white hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-white/20"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={i18n.language === 'pt' ? 'Selecionar Idioma' : 'Select Language'}
      >
        <selectedLang.Icon className="w-4 h-4 rounded-sm" />
        <span>{selectedLang.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1" role="none">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  onKeyDown={(e) => handleKeyDown(e, lang)}
                  className={`cursor-pointer flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                    selectedLang.code === lang.code
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  role="menuitem"
                  tabIndex={0}
                >
                  <lang.Icon className="w-4 h-4 rounded-sm" />
                  <span className="flex-1 text-left">{lang.name}</span>
                  {selectedLang.code === lang.code && (
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
