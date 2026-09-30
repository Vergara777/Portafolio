'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FolderGit2, X, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/section';
import { projects } from '@/data/projects';
import { getTechIcon, GithubIcon, BitbucketIcon } from '@/components/icons';
import FolderFloat from '@/components/FolderFloat';

const folderFilters = [
  'Todos',
  'FieldOps',
  'Microservicio',
  'Pharma',
  'Angular',
  'Spring Boot',
  'Laravel',
  'Docker',
];

export function Projects() {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  // Filtrar proyectos según la píldora seleccionada en FolderFloat
  const filteredProjects = projects.filter((p) => {
    if (!selectedFilter || selectedFilter === 'Todos') return true;
    const term = selectedFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.stack.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <Section
      id="projects"
      title="Proyectos"
      icon={<FolderGit2 size={22} className="text-neutral-500" />}
    >
      {/* Componente Interactivo FolderFloat de React Bits como Filtro Dinámico */}
      <div className="mb-12 flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 text-center shadow-md dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative py-2 flex justify-center w-full">
          <FolderFloat
            items={folderFilters}
            label="Filtrar Proyectos"
            sublabel="Pasa el cursor o haz clic para abrir"
            trigger="hover"
            physics
            drift={0.5}
            onSelect={(value) => setSelectedFilter(value)}
            folderColor="#27272a"
            frontColor="#3f3f46"
            paperColor="#f4f4f5"
            itemColor="#18181b"
            itemTextColor="#f4f4f5"
            labelColor="#fafafa"
            width={220}
            height={148}
            spread={190}
            lift={28}
          />
        </div>

        {/* Barra de estado del filtro activo con botón para limpiar */}
        <div className="mt-5 flex items-center gap-2">
          {selectedFilter !== 'Todos' ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span>
                Filtrando por: <strong>{selectedFilter}</strong> ({filteredProjects.length}{' '}
                {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'})
              </span>
              <button
                onClick={() => setSelectedFilter('Todos')}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-700 dark:text-emerald-300 transition"
                title="Quitar filtro"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-400">
              Mostrando todos los proyectos ({projects.length})
            </span>
          )}
        </div>
      </div>

      {/* Grid de Proyectos Filtrados */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p) => {
            const isBitbucket = p.repoType === 'bitbucket' || p.repo?.includes('bitbucket');

            return (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={p.title}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-neutral-400 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {p.title}
                      </h3>
                      <span className="mt-1 inline-block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {p.role}
                      </span>
                    </div>

                    {/* Botón interactivo de GitHub o Bitbucket con flecha animada y micro-interacción */}
                    <div className="relative group/repo">
                      <a
                        href={p.repo || (isBitbucket ? 'https://bitbucket.org' : 'https://github.com')}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ver repositorio de ${p.title}`}
                        className="relative flex items-center gap-2 rounded-xl border border-neutral-300/80 bg-background/90 px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:scale-105 hover:border-neutral-500 hover:bg-neutral-100 hover:shadow-md dark:border-neutral-700/80 dark:bg-neutral-900/90 dark:hover:border-neutral-500 dark:hover:bg-neutral-800 shadow-xs"
                      >
                        {isBitbucket ? <BitbucketIcon size={17} /> : <GithubIcon size={17} />}
                        <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                          {isBitbucket ? 'Bitbucket' : 'GitHub'}
                        </span>
                        {/* Flecha dinámica con animación de desplazamiento diagonal */}
                        <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden text-blue-500 dark:text-cyan-400">
                          <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300 ease-out group-hover/repo:translate-x-1 group-hover/repo:-translate-y-1"
                          />
                        </span>
                      </a>

                      {/* Tooltip dinámico con flecha animada */}
                      <div className="pointer-events-none absolute -top-11 right-0 z-30 hidden -translate-y-1 scale-95 opacity-0 transition-all duration-300 group-hover/repo:flex group-hover/repo:translate-y-0 group-hover/repo:scale-100 group-hover/repo:opacity-100">
                        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-neutral-950 px-3 py-1 text-[11px] font-mono font-medium text-white shadow-2xl dark:bg-white dark:text-neutral-900 ring-1 ring-white/10">
                          <span>{isBitbucket ? 'Abrir en Bitbucket' : 'Abrir en GitHub'}</span>
                          <ArrowUpRight size={13} className="text-blue-400 dark:text-cyan-400 animate-pulse" />
                          <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-neutral-950 dark:bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {p.description}
                </p>
              </div>

              <div className="mt-6">
                <ul className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {getTechIcon(s, 12)}
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>

                {(p.href || p.repo) && (
                  <div className="mt-5 flex items-center gap-4 border-t border-neutral-200/80 pt-4 text-sm dark:border-neutral-800/80">
                    {p.href && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 font-medium text-neutral-700 transition hover:text-foreground dark:text-neutral-300"
                      >
                        <ExternalLink size={14} /> Ver sitio
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link flex items-center gap-1.5 font-medium text-neutral-700 transition hover:text-foreground dark:text-neutral-300"
                      >
                        {isBitbucket ? <BitbucketIcon size={14} /> : <GithubIcon size={14} />}
                        <span>{isBitbucket ? 'Bitbucket' : 'Código'}</span>
                        <ArrowUpRight
                          size={13}
                          className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-neutral-500"
                        />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}