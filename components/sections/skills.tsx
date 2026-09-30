'use client';

import { motion } from 'framer-motion';
import { Code, Server, Boxes, Layers } from 'lucide-react';
import { Section } from '@/components/section';
import { skills } from '@/data/skills';
import { getTechIcon } from '@/components/icons';

function getGroupIcon(group: string) {
  const norm = group.toLowerCase();
  if (norm.includes('front')) {
    return <Code size={18} className="text-sky-500" />;
  }
  if (norm.includes('back')) {
    return <Server size={18} className="text-emerald-500" />;
  }
  return <Boxes size={18} className="text-purple-500" />;
}

export function Skills() {
  return (
    <Section
      id="skills"
      title="Habilidades y Tecnologías"
      icon={<Layers size={22} className="text-neutral-500" />}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {skills.map((g, index) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 shadow-md"
          >
            <div className="mb-4 flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
              {getGroupIcon(g.group)}
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {g.group}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {g.items.map((i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs sm:text-sm font-medium transition hover:border-neutral-400 hover:scale-[1.02] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {getTechIcon(i, 16)}
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}