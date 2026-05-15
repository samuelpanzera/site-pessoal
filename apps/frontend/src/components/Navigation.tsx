import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageSwitcher } from './LanguageSwitcher';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const lastUpdatedRaw = import.meta.env.VITE_LAST_UPDATED;

  const formattedDate = useMemo(() => {
    if (!lastUpdatedRaw) return '';
    try {
      const date = new Date(lastUpdatedRaw);
      if (isNaN(date.getTime())) return lastUpdatedRaw;
      
      const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
      const formatted = date.toLocaleDateString(locale, {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
      
      return formatted.replace('.', '').toUpperCase();
    } catch (e) {
      return lastUpdatedRaw;
    }
  }, [lastUpdatedRaw, i18n.language]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md h-16 flex items-center px-6">
        <div className="flex-1 flex items-center gap-4 font-space-grotesk">
          <Link 
            to="/" 
            className="font-bold text-xl tracking-tighter hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            S.<span className="text-primary-container">_</span>PANZERA
          </Link>
          {lastUpdatedRaw && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/40 bg-primary-container/5">
              <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/70">
                {t('footer.last_updated')} {formattedDate}
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-container" />
              </span>
            </div>
          )}
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          {isHome ? (
            <>
              <a href="#hero" className="text-on-surface hover:text-primary transition-colors">{t('nav.home')}</a>
              <a href="#projetos" className="hover:text-primary transition-colors">{t('nav.projects')}</a>
            </>
          ) : (
            <>
              <Link to="/" className="text-on-surface hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link to="/#projetos" className="hover:text-primary transition-colors">{t('nav.projects')}</Link>
            </>
          )}
          <a 
            href="https://linkedin.com/in/samuelpanzera" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            {t('nav.contact')}
            <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <Link 
            to="/blog" 
            className={`hover:text-primary transition-colors ${location.pathname.startsWith('/blog') ? 'text-primary' : ''}`}
          >
            {t('nav.blog')}
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          
          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:text-primary transition-colors z-[101] relative"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-current rounded-full origin-left transition-transform"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-current rounded-full transition-opacity"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-current rounded-full origin-left transition-transform"
              />
            </div>
          </button>

          <button
            disabled
            className="hidden md:block cursor-not-allowed px-4 py-2 rounded-md border border-primary-container/30 text-xs font-bold uppercase tracking-widest opacity-50"
          >
            {t('nav.pdi_access')}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] md:hidden bg-background pt-24 px-8 flex flex-col gap-8 shadow-2xl"
          >
            <div className="flex flex-col gap-6 text-2xl font-space-grotesk font-bold">
              {isHome ? (
                <>
                  <a 
                    href="#hero" 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {t('nav.home')}
                  </a>
                  <a 
                    href="#projetos" 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {t('nav.projects')}
                  </a>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    to="/#projetos" 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {t('nav.projects')}
                  </Link>
                </>
              )}
              <Link 
                to="/blog" 
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-primary transition-colors ${location.pathname.startsWith('/blog') ? 'text-primary' : ''}`}
              >
                {t('nav.blog')}
              </Link>
              <a 
                href="https://linkedin.com/in/samuelpanzera" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                {t('nav.contact')}
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="mt-auto pb-12 space-y-8">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                <span className="text-sm text-on-surface-variant font-medium">Select Language</span>
                <LanguageSwitcher />
              </div>

              {lastUpdatedRaw && (
                <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-primary-container/20 bg-primary-container/5">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/70">
                    {t('footer.last_updated')} {formattedDate}
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
