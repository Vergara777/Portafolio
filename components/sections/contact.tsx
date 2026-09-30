import { Mail } from 'lucide-react';
import { Section } from '@/components/section';
import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon, BitbucketIcon } from '@/components/icons';

export function Contact() {
  return (
    <Section
      id="contact"
      title="Contacto"
      icon={<Mail size={22} className="text-neutral-500" />}
      centered
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          ¿Tienes una idea, una vacante o quieres que trabajemos juntos? Escríbeme y te respondo lo más pronto posible.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 shadow-sm"
          >
            <Mail size={18} />
            <span>{profile.email}</span>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-100 hover:border-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:border-neutral-500"
          >
            <GithubIcon size={18} />
            <span>GitHub</span>
          </a>
          <a
            href={profile.bitbucket}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-100 hover:border-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:border-neutral-500"
          >
            <BitbucketIcon size={18} />
            <span>Bitbucket</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-100 hover:border-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:border-neutral-500"
          >
            <LinkedinIcon size={18} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </Section>
  );
}