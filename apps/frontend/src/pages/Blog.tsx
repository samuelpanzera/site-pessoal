import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ArchitectureBackground from '../components/ArchitectureBackground';

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // In a real app, this would come from a data file or API
  const posts = [
    {
      id: 'void-architecture',
      title: t('blog.posts.void-architecture.title'),
      date: t('blog.posts.void-architecture.date'),
      summary: t('blog.posts.void-architecture.summary'),
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
      <Navigation />
      <ArchitectureBackground />
      
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-space-grotesk font-bold tracking-tight mb-6"
          >
            {t('blog.title')} <span className="text-primary">{t('blog.title_highlight')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant text-lg max-w-2xl leading-relaxed"
          >
            {t('blog.description')}
          </motion.p>
        </header>

        <div className="grid gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-surface-container border border-white/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-primary text-xs font-bold uppercase tracking-widest border border-primary/40 px-2 py-1 rounded">
                  {t('blog.read_more')}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-primary opacity-70 tracking-widest uppercase">
                  [{post.date}]
                </span>
                <h2 className="text-2xl font-space-grotesk font-bold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
