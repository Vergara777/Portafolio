'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';

const links = [
  { href: '#about', id: 'about', label: 'Sobre mí' },
  { href: '#projects', id: 'projects', label: 'Proyectos' },
  { href: '#skills', id: 'skills', label: 'Skills' },
  { href: '#contact', id: 'contact', label: 'Contacto' },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      let current = '';

      for (const link of links) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = link.href;
          }
        }
      }

      // Si llegó al final de la página, activa Contacto
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        current = '#contact';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-background/80 backdrop-blur dark:border-neutral-800">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-center px-6 sm:px-10 lg:px-12">
        {/* Navegación centrada con rayita indicadora activa */}
        <nav className="flex items-center justify-center">
          <ul className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
            {links.map((l) => {
              const isActive = activeSection === l.href;
              return (
                <li key={l.href} className="relative py-1">
                  <a
                    href={l.href}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-neutral-950 font-semibold dark:text-white'
                        : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {l.label}
                  </a>
                  {isActive && (
                    <motion.div
                      layoutId="header-active-line"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-neutral-950 dark:bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle de tema a la derecha */}
        <div className="absolute right-6 sm:right-10 lg:right-12 flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}