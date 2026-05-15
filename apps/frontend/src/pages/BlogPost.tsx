import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ArchitectureBackground from '../components/ArchitectureBackground';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // In a real app, we would fetch or find the post
  if (id !== 'void-architecture') {
    return <div>Post not found</div>;
  }

  const postKey = `blog.posts.${id}`;

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
      <Navigation />
      <ArchitectureBackground />

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/tech-details-pdi')}
          className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {t('blog.back_to_blog')}
        </motion.button>

        <article className="prose prose-invert max-w-none">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-primary font-mono text-sm tracking-[0.2em] uppercase mb-4 block">
              [{t(`${postKey}.date`)}]
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold tracking-tight leading-tight mb-8">
              {t(`${postKey}.title`)}
            </h1>
            <div className="h-px w-24 bg-primary/40" />
          </motion.header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-16 text-lg text-on-surface-variant leading-relaxed font-manrope"
          >
            {[
              { title: 'podman_title', content: 'podman_content' },
              { title: 'ci_cd_title', content: 'ci_cd_content' },
              { title: 'performance_title', content: 'performance_content' },
              { title: 'frontend_title', content: 'frontend_content' },
              { title: 'future_title', content: 'future_content' }
            ].map((section) => (
              <section key={section.title} className="space-y-6">
                <h2 className="text-3xl font-space-grotesk font-bold text-on-surface uppercase tracking-wide border-b border-primary/20 pb-4">
                  {t(`${postKey}.content.${section.title}`)}
                </h2>
                <div className="space-y-6">
                  {t(`${postKey}.content.${section.content}`).split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
