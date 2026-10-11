'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { flushSync } from 'react-dom';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [rippleKey, setRippleKey] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9 rounded-xl border border-neutral-300/40 dark:border-neutral-700/40 opacity-0" />;
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? 'light' : 'dark';
    setRippleKey(Date.now());

    // Animación de onda circular lenta, fluida y cinematográfica (View Transitions API)
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX || rect.left + rect.width / 2;
      const y = e.clientY || rect.top + rect.height / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            // Duración pausada y curva suave y elegante tipo seda
            duration: 900,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      // Fallback estándar
      setTheme(nextTheme);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92, rotate: isDark ? 8 : -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleToggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="relative flex size-9 items-center justify-center rounded-xl border border-neutral-300/80 bg-white/80 shadow-xs backdrop-blur-xs transition-colors hover:border-amber-400/60 hover:bg-neutral-100 dark:border-neutral-700/80 dark:bg-neutral-900/80 dark:hover:border-indigo-400/60 dark:hover:bg-neutral-800 cursor-pointer overflow-hidden group"
    >
      {/* Resplandor sutil en hover */}
      <span className="absolute inset-0 bg-radial from-amber-400/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-indigo-400/20" />

      {/* Onda expansiva (ripple ring) suave y pausada que acompaña la transición */}
      <AnimatePresence>
        {rippleKey && (
          <motion.span
            key={rippleKey}
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 rounded-xl border-2 border-amber-400/80 dark:border-indigo-400/80 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Íconos con transición suave, pausada y cremosa */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -45, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 45, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          >
            <Sun size={18} className="stroke-[2.2]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: 45, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -45, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.45)]"
          >
            <Moon size={18} className="stroke-[2.2]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}