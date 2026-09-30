'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Section } from '@/components/section';
import { profile } from '@/data/profile';

export function About() {
  return (
    <Section
      id="about"
      title="Sobre mí"
      icon={<User size={22} className="text-neutral-500" />}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
        {/* Columna Izquierda: Tarjeta con la Foto de Perfil Oficial */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative group w-full max-w-sm">
            {/* Resplandor decorativo de fondo */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 blur-xl transition duration-500 group-hover:opacity-35" />

            <div className="relative rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-inner">
                <Image
                  src="/images/FotoPerfil.png"
                  alt={`${profile.name} Vergara`}
                  fill
                  sizes="(max-width: 640px) 100vw, 380px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                  priority
                />
                {/* Gradiente inferior con nombre y rol */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 text-white">
                  <p className="text-xl font-bold tracking-tight">{profile.name} E. Vergara</p>
                  <p className="text-xs text-neutral-300 font-mono mt-0.5">
                    Full-stack Developer
                  </p>
                </div>
              </div>

              {/* Fila de detalles rápidos del perfil */}
              <div className="mt-4 flex items-center justify-between px-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-blue-500" /> Colombia
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-emerald-500" /> Junior Dev
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="flex items-center gap-1">
                  <GraduationCap size={13} className="text-purple-500" /> Software Eng
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Columna Derecha: Tarjetas de Información Personal */}
        <div className="lg:col-span-7 space-y-5">
          {profile.about.map((p, index) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed"
            >
              <p>{p}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}