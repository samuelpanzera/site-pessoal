import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects, type ProjectItem } from '../hooks/useProjects';

type ProjectCardProps = Pick<ProjectItem, 'title' | 'techStack' | 'link'> & {
  description: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, techStack, link }) => {
  const { t } = useTranslation();

  return (
    <div className="group p-8 rounded-xl bg-surface-container border border-white/5 hover:border-primary/50 transition-all duration-300 hover:glow-purple flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div className="h-1 w-12 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
        <h3 className="text-2xl font-space-grotesk font-bold tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {techStack.map((tech) => (
            <span key={tech} className="px-2 py-1 rounded bg-secondary-container text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="pt-8">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
        >
          {t('projects.explore')} <span className="text-lg">→</span>
        </a>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { projects, loading } = useProjects();
  const isPt = i18n.language.startsWith('pt');
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-space-grotesk font-bold tracking-tight">
          {t('projects.title')} <span className="text-primary-container">{t('projects.title_highlight')}</span>
        </h2>
        <p className="max-w-xl text-on-surface-variant">
          {t('projects.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant animate-pulse">
            {t('projects.loading')}
          </div>
        ) : (
          sorted.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={isPt ? project.description.pt : project.description.en}
              techStack={project.techStack}
              link={project.link}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Projects;
