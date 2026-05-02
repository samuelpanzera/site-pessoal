import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
}

const LogItem: React.FC<LogEntry> = ({ date, title, description }) => {
  const { i18n } = useTranslation();
  const formattedDate = new Date(date).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="relative pl-10 pb-12 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[5px] top-2 bottom-0 w-px bg-white/10" />
      
      {/* Timeline Dot */}
      <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(221,183,255,0.6)]" />
      
      <div className="space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
          {formattedDate}
        </div>
        <h4 className="text-lg font-space-grotesk font-bold tracking-tight">
          {title}
        </h4>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
};

const ExecutionLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/api/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch logs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-space-grotesk font-bold tracking-tight">
            {t('execution_log.title')} <span className="text-primary-container">{t('execution_log.title_highlight')}</span>
          </h2>
          <p className="max-w-xl text-on-surface-variant">
            {t('execution_log.description')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {t('execution_log.clock_label')}
          </div>
          <div className="font-space-grotesk text-xl font-bold text-primary tabular-nums">
            {new Date().toLocaleTimeString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { hour12: false })}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-8 md:p-12 rounded-2xl border border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant animate-pulse font-mono text-sm">
            {t('execution_log.loading')}
          </div>
        ) : (
          <div className="relative">
            {logs.map((log) => (
              <LogItem key={log.id} {...log} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExecutionLog;
