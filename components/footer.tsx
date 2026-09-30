'use client';

import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon, BitbucketIcon } from '@/components/icons';
import { Mail, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200/80 bg-background dark:border-neutral-800/80 py-10">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Identidad / Rol */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              {profile.name}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Software Engineer • Full-stack Developer
            </span>
          </div>

          {/* Contacto directo y Redes */}
          <div className="flex items-center gap-5 text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <Mail size={15} />
              <span>{profile.email}</span>
            </a>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex items-center gap-2.5">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-background transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <GithubIcon size={15} />
              </a>
              <a
                href={profile.bitbucket}
                target="_blank"
                rel="noreferrer"
                aria-label="Bitbucket"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-background transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <BitbucketIcon size={15} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-background transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <LinkedinIcon size={15} />
              </a>
              <button
                onClick={scrollToTop}
                title="Volver arriba"
                aria-label="Volver arriba"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-background transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>

          {/* Copyright formal */}
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} {profile.name}. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}