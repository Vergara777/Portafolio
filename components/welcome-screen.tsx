'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, User, Globe, ArrowRight } from 'lucide-react';
import BlurText from '@/components/BlurText';

export function WelcomeScreen({ onFinished }: { onFinished?: () => void }) {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Bloquea el scroll del cuerpo mientras la bienvenida está activa
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  useEffect(() => {
    // Permite admirar la bienvenida durante 4.2 segundos antes de la traslación suave automática
    const timer = setTimeout(() => {
      handleExit();
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setShow(false);
    if (onFinished) onFinished();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome-splash-overlay"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: '-100%',
            opacity: 0.95,
            transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-between bg-[#080808] px-6 py-10 text-white select-none overflow-hidden"
        >
          {/* Fondo con leve resplandor radial */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)] pointer-events-none" />

          {/* Iconos superiores: </> Code, 👤 User, 🌐 Globe */}
          <div className="relative pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md shadow-2xl"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300">
                <Code2 size={16} />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300">
                <User size={16} />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300">
                <Globe size={16} />
              </div>
            </motion.div>
          </div>

          {/* Tipografía animada BlurText de React Bits */}
          <div className="relative my-auto flex flex-col items-center text-center w-full max-w-4xl px-2">
            <BlurText
              text="Welcome to my"
              delay={80}
              animateBy="words"
              direction="top"
              className="text-2xl font-extrabold tracking-tight sm:text-4xl text-neutral-300 justify-center"
            />

            <div className="w-full my-4 flex items-center justify-center">
              <BlurText
                text="Portfolio Website"
                delay={50}
                animateBy="letters"
                direction="bottom"
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white justify-center"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-neutral-400 font-mono tracking-wide"
            >
              <span>www.luisvergara.dev</span>
            </motion.div>
          </div>

          {/* Barra de progreso y botón de entrar directo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative flex flex-col items-center gap-3 pb-2"
          >
            <button
              onClick={handleExit}
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-neutral-300 transition hover:border-white/50 hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <span>Entrar al portafolio</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.0, ease: 'linear' }}
                className="h-full bg-white/80"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
