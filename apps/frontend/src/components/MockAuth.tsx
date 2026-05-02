import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MockAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const MockAuth: React.FC<MockAuthProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();
  
  // Get messages from translation, ensuring it's an array
  const messages = t('mock_auth.messages', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    if (step < messages.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // Auto close or redirect here
      const timer = setTimeout(() => {
        onClose();
        alert(t('mock_auth.alert'));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step, onClose, messages, t]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl">
      <div className="max-w-md w-full bg-surface-container p-10 rounded-2xl border border-white/10 shadow-2xl space-y-8 text-center">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-space-grotesk font-bold">{t('mock_auth.title')}</h3>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${(step / messages.length) * 100}%` }}
            />
          </div>
          <p className="text-sm font-mono text-primary animate-pulse">
            {step < messages.length ? `[RUN] ${messages[step]}` : t('mock_auth.success')}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
        >
          {t('mock_auth.cancel')}
        </button>
      </div>
    </div>
  );
};

export default MockAuth;
