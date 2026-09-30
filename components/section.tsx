'use client';

import { motion } from 'framer-motion';

export function Section({
  id,
  title,
  icon,
  centered = false,
  className = '',
  children,
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  centered?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`scroll-mt-20 py-10 sm:py-14 ${className}`}
    >
      <div className={`mb-6 flex items-center gap-3 ${centered ? 'justify-center text-center' : ''}`}>
        {icon && <span className="text-neutral-500 dark:text-neutral-400">{icon}</span>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}