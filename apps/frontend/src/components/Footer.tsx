import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolioLastUpdated } from '../hooks/usePortfolioLastUpdated';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lastUpdated = usePortfolioLastUpdated();

  const formattedDate = lastUpdated
    ? lastUpdated.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
    : null;

  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <div className="font-space-grotesk font-bold text-2xl tracking-tighter">
            DEV<span className="text-primary-container">_</span>VOID
          </div>
          <p className="max-w-sm text-on-surface-variant text-sm leading-relaxed">
            {t('footer.description')}
          </p>
        </div>
        
        <div className="space-y-6">
          <h5 className="text-xs font-bold uppercase tracking-widest text-white">{t('footer.navigation')}</h5>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">{t('nav.home')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('nav.projects')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('nav.tech_stack')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('nav.execution_log')}</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-xs font-bold uppercase tracking-widest text-white">{t('footer.connectivity')}</h5>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
            <li>
              <a
                href="https://linkedin.com/in/samuelpanzera"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.732-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.047-8.787 0-9.7h3.554v1.374c.43-.664 1.199-1.61 2.920-1.61 2.134 0 3.732 1.404 3.732 4.425v5.511zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.953.77-1.71 1.958-1.71 1.187 0 1.914.757 1.948 1.71 0 .951-.761 1.71-1.991 1.71zm1.581 11.597H3.715V9.752h3.203v10.7zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </li>
            <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Email</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-24 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
        <div className="flex flex-col gap-1">
          <div>&copy; {new Date().getFullYear()} {t('footer.version')}</div>
          {formattedDate && (
            <div className="text-primary/50">{t('footer.last_updated')}: {formattedDate}</div>
          )}
        </div>
        <div className="flex gap-8">
          <span>{t('footer.oled_friendly')}</span>
          <span>{t('footer.system_ready')}</span>
          <span>BUN + GO + REACT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
