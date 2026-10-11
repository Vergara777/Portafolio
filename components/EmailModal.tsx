'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Copy, Check, ExternalLink, X, Laptop } from 'lucide-react';
import { profile } from '@/data/profile';

// Ícono oficial de Gmail
function GmailIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
      <path fill="#1e88e5" d="M3,16.2l5,2.75l5,4.75L13,40H6c-1.657,0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 24,26 36,17" />
      <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L8.608,7.706C7.035,6.526,4.764,7.404,4.385,9.336L3,12.298z" />
      <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l4.392-3.494c1.573-1.18,3.844-0.302,4.223,1.63L45,12.298z" />
    </svg>
  );
}

// Ícono oficial de Microsoft Outlook
function OutlookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <path fill="#0078d4" d="M28,8h11c1.657,0,3,1.343,3,3v26c0,1.657-1.343,3-3,3H28V8z" />
      <path fill="#28a8ea" d="M11,8h17v32H11c-1.657,0-3-1.343-3-3V11C8,9.343,9.343,8,11,8z" />
      <path fill="#025fb2" d="M28,8v16l14-7.5V11c0-1.657-1.343-3-3-3H28z" />
      <path fill="#004e98" d="M28,24v16h11c1.657,0,3-1.343,3-3v-5.5L28,24z" />
      <circle cx="19" cy="24" r="7" fill="#ffffff" />
      <circle cx="19" cy="24" r="4.5" fill="#0078d4" />
    </svg>
  );
}

// Ícono de Yahoo Mail
function YahooIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <rect width="48" height="48" rx="10" fill="#6001d2" />
      <path
        d="M14 14l6.5 12.5v9.5h5v-9.5L32 14h-5.2l-3.8 8.2L19.2 14H14z"
        fill="#ffffff"
      />
    </svg>
  );
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const subject = encodeURIComponent('Contacto desde tu Portafolio');
  const email = encodeURIComponent(profile.email);

  const options = [
    {
      name: 'Gmail',
      desc: 'Redactar en tu bandeja de Gmail Web',
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`,
      icon: <GmailIcon size={22} />,
      isExternal: true,
      tag: 'Recomendado',
    },
    {
      name: 'Outlook / Hotmail',
      desc: 'Abrir en Outlook.com Web',
      href: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}`,
      icon: <OutlookIcon size={22} />,
      isExternal: true,
      tag: 'Web',
    },
    {
      name: 'Yahoo Mail',
      desc: 'Redactar en Yahoo Mail Web',
      href: `https://compose.mail.yahoo.com/?to=${email}&subject=${subject}`,
      icon: <YahooIcon size={22} />,
      isExternal: true,
      tag: 'Web',
    },
    {
      name: 'App del sistema',
      desc: 'Abrir en cliente instalado en tu equipo',
      href: `mailto:${profile.email}?subject=${subject}`,
      icon: <Laptop size={20} className="text-neutral-600 dark:text-neutral-400" />,
      isExternal: false,
    },
  ];

  if (!mounted) return null;

  // Se renderiza con createPortal directamente en document.body para quedar 100% por encima del header y todo el contenido
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 select-none">
          {/* Backdrop opaco con desenfoque que oscurece y separa totalmente el fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Tarjeta del Modal: fondo 100% sólido (bg-white / dark:bg-neutral-900), sin transparencias para que NADA se mezcle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Encabezado Profesional */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 shadow-2xs">
                <Mail size={18} className="text-neutral-700 dark:text-neutral-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Enviar correo
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Selecciona tu proveedor preferido para redactar:
                </p>
              </div>
            </div>

            {/* Chip para copiar el correo directamente */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-950 shadow-inner">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail size={14} className="shrink-0 text-neutral-400" />
                <span className="truncate font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {profile.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer border ${
                  copied
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Lista de Proveedores de Correo */}
            <div className="mt-4 flex flex-col gap-2">
              {options.map((opt) => (
                <a
                  key={opt.name}
                  href={opt.href}
                  target={opt.isExternal ? '_blank' : undefined}
                  rel={opt.isExternal ? 'noreferrer noopener' : undefined}
                  onClick={() => onClose()}
                  className="group flex items-center justify-between rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-3 transition hover:border-neutral-400 hover:shadow-xs active:scale-[0.99] dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700/80">
                      {opt.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white">
                          {opt.name}
                        </span>
                        {opt.tag && (
                          <span className="rounded-md bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                  />
                </a>
              ))}
            </div>

            {/* Nota de pie limpia y profesional sin emojis */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
              <ExternalLink size={12} className="opacity-70" />
              <span>Se abrirá una nueva pestaña con el mensaje listo para redactar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Botón contenedor reutilizable que incluye el trigger y el modal integrado
interface EmailContactButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function EmailContactButton({ className, children }: EmailContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>

      <EmailModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
