'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useAnimationFrame,
  animate,
  type PanInfo,
} from 'framer-motion';
import { Download, ArrowRight, ArrowDown } from 'lucide-react';
import { profile } from '@/data/profile';
import { getTechIcon, GithubIcon, LinkedinIcon, BitbucketIcon } from '@/components/icons';
import TextType from '@/components/TextType';

const highlightTechs = ['Angular', 'Spring Boot', 'React', 'Docker', 'MySQL'];
const BASE_BADGE_Y = 220;

// Cálculo matemático preciso de la cinta del Lanyard:
// - start: nace exactamente en el anclaje del header (x: 144, y: 2)
// - pivot: punto de rotación del carnet (144 + currX, BASE_BADGE_Y + currY)
// - end: entra 14px dentro de la abrazadera metálica siguiendo la misma tangente
const getStrapD = (currX: number, currY: number) => {
  const startX = 144;
  const startY = 2;
  const pivotX = 144 + currX;
  const pivotY = BASE_BADGE_Y + currY;

  const dx = pivotX - startX;
  const dy = Math.max(30, pivotY - startY);
  const angleRad = Math.atan2(dx, dy);

  // Extremo de la cinta: entra 14px dentro de la abrazadera metálica en la dirección exacta de la tensión
  const endX = pivotX + 14 * Math.sin(angleRad);
  const endY = pivotY + 14 * Math.cos(angleRad);

  const totalDx = endX - startX;
  const totalDy = endY - startY;

  // Curvatura natural de cinta tensada con ligera holgura si se empuja hacia arriba
  const slack = Math.max(0, -currY * 0.12);
  const cp1X = startX + totalDx * 0.33;
  const cp1Y = startY + totalDy * 0.33 + slack;
  const cp2X = startX + totalDx * 0.67;
  const cp2Y = startY + totalDy * 0.67 + slack * 0.7;

  return `M ${startX} ${startY} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)} ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
};

const INITIAL_STRAP_D = getStrapD(0, 0);

export function Hero({ welcomeDone }: { welcomeDone?: boolean }) {
  // Motion values para la física del carnet y la cinta interactiva
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Inclinación física natural del carnet:
  // El ángulo del carnet y la abrazadera metálica coinciden exactamente con la línea de la cinta (0° de desfase)
  const dragRotate = useTransform([x, y], ([latestX, latestY]: any[]) => {
    const currentY = Math.max(30, BASE_BADGE_Y + (latestY ?? 0) - 2);
    const currentX = latestX ?? 0;
    const angleRad = Math.atan2(currentX, currentY);
    return angleRad * (180 / Math.PI);
  });

  // Referencias directas al DOM para actualización instantánea (0ms de latencia, 0 re-renders de React)
  const strapCurveRef = useRef<SVGPathElement | null>(null);
  const strapShadowRef = useRef<SVGPathElement | null>(null);
  const strapBorderRef = useRef<SVGPathElement | null>(null);
  const strapBodyRef = useRef<SVGPathElement | null>(null);
  const strapStitchRef = useRef<SVGPathElement | null>(null);
  const lastPathD = useRef<string>('');

  const updateStrapDOM = useCallback((currX: number, currY: number) => {
    const d = getStrapD(currX, currY);
    if (lastPathD.current === d) return;
    lastPathD.current = d;

    if (strapShadowRef.current) strapShadowRef.current.setAttribute('d', d);
    if (strapBorderRef.current) strapBorderRef.current.setAttribute('d', d);
    if (strapBodyRef.current) strapBodyRef.current.setAttribute('d', d);
    if (strapStitchRef.current) strapStitchRef.current.setAttribute('d', d);
    if (strapCurveRef.current) strapCurveRef.current.setAttribute('d', d);
  }, []);

  // 1. Sincronización inmediata al mover el ratón (se ejecuta sincrónicamente con el evento de arrastre):
  useMotionValueEvent(x, 'change', (latestX) => {
    updateStrapDOM(latestX, y.get());
  });

  useMotionValueEvent(y, 'change', (latestY) => {
    updateStrapDOM(x.get(), latestY);
  });

  // 2. Sincronización en cada frame de renderizado (física del péndulo, caída libre y rebotes a 120 FPS):
  useAnimationFrame(() => {
    updateStrapDOM(x.get(), y.get());
  });

  // Animación de entrada pendular cuando la bienvenida se cierra o al cargar:
  // Caída desde el techo con brinquito ("pum, brinquito!") y oscilación física
  useEffect(() => {
    const triggerDrop = () => {
      animate(y, [-380, 26, -16, 8, -3, 0], {
        duration: 2.1,
        times: [0, 0.42, 0.65, 0.8, 0.92, 1],
        ease: [0.25, 1, 0.35, 1],
      });
      animate(x, [-45, 30, -16, 8, -2, 0], {
        duration: 2.1,
        times: [0, 0.42, 0.65, 0.8, 0.92, 1],
        ease: [0.25, 1, 0.35, 1],
      });
    };

    if (welcomeDone) {
      triggerDrop();
    } else {
      const t = setTimeout(triggerDrop, 500);
      return () => clearTimeout(t);
    }
  }, [welcomeDone, x, y]);

  // Al soltar el carnet tras arrastrarlo:
  // Péndulo armónico realista libre (underdamped harmonic oscillator).
  const handleDragEnd = (_: any, info: PanInfo) => {
    animate(x, 0, {
      type: 'spring',
      velocity: info.velocity.x,
      stiffness: 65,
      damping: 5.5,
      mass: 1,
    });
    animate(y, 0, {
      type: 'spring',
      velocity: info.velocity.y,
      stiffness: 130,
      damping: 8,
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col pt-0 pb-12 overflow-visible"
    >
      {/* Retícula de fondo sutil */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-30 -z-10" />
      <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="relative grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Columna Izquierda: Información Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start lg:col-span-7 pt-8 sm:pt-12 lg:pt-20"
        >
          {/* Contenedor del Título con altura mínima reservada y layout animado suave */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="w-full max-w-2xl select-none min-h-[140px] sm:min-h-[190px] lg:min-h-[210px] flex items-center"
          >
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-[1.08] text-neutral-950 dark:text-white select-none">
              <TextType
                text={['Full-stack Developer', 'Software Engineer']}
                typingSpeed={75}
                deletingSpeed={38}
                pauseDuration={2200}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-blue-600 dark:text-cyan-400 font-mono font-bold ml-1 align-baseline inline-block"
                loop={true}
              />
            </h1>
          </motion.div>

          {/* Subtítulo tipo terminal con layout animado suave pegado a la medida adecuada */}
          <motion.p
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="mt-2 font-mono text-sm tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Software Engineer • Junior Programmer _
          </motion.p>

          {/* Descripción bio con layout animado suave */}
          <motion.p
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300/85"
          >
            {profile.tagline}
          </motion.p>

          {/* Pills con iconos reales oficiales (fondo sólido para que no transparente la malla) */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {highlightTechs.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                {getTechIcon(tech, 15)}
                <span>{tech}</span>
              </span>
            ))}
          </motion.div>

          {/* Botones de acción limpios y elegantes */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              Ver proyectos
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href={profile.cv}
              download="Luis_Eduardo_Vergara_CV.pdf"
              className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold transition hover:bg-neutral-100 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 shadow-xs"
            >
              <Download size={16} /> Descargar CV
            </a>

            <div className="flex items-center gap-2 pl-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-white transition hover:scale-105 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600 shadow-xs"
              >
                <GithubIcon size={19} />
              </a>
              <a
                href={profile.bitbucket}
                target="_blank"
                rel="noreferrer"
                aria-label="Bitbucket"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-white transition hover:scale-105 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600 shadow-xs"
              >
                <BitbucketIcon size={19} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-white transition hover:scale-105 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600 shadow-xs"
              >
                <LinkedinIcon size={19} />
              </a>
            </div>
          </motion.div>

          {/* Nota inferior */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="mt-8 flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400"
          >
            <ArrowDown size={14} className="animate-bounce" />
            <span>explore my work below / open to opportunities</span>
          </motion.div>
        </motion.div>

        {/* Columna Derecha: Carnet Colgante que Nace Directamente en el Header */}
        <div className="relative flex justify-center lg:col-span-5 lg:justify-end pt-0">
          <div className="relative w-72 min-h-[640px] flex flex-col items-center">
            {/* Soporte fijo en la orilla exacta del header (0px de espacio, pegado al header) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="h-3.5 w-16 rounded-b-md bg-neutral-900 border-x border-b border-neutral-700 shadow-2xl flex items-center justify-center">
                <div className="h-1 w-9 rounded-full bg-neutral-500" />
              </div>
              <div className="h-2 w-7 bg-neutral-800 border-x border-neutral-700 shadow-xs" />
            </div>

            {/* SVG dinámico de la cinta: Nace en la orilla del header (top: 0) */}
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-[650px] pointer-events-none overflow-visible z-10"
              viewBox="0 0 288 650"
            >
              <defs>
                <path ref={strapCurveRef} id="lanyard-curve" d={INITIAL_STRAP_D} />
              </defs>

              {/* Sombra de la cinta */}
              <path
                ref={strapShadowRef}
                d={INITIAL_STRAP_D}
                fill="none"
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Borde exterior de la cinta */}
              <path
                ref={strapBorderRef}
                d={INITIAL_STRAP_D}
                fill="none"
                stroke="#121212"
                strokeWidth="22"
                strokeLinecap="round"
              />

              {/* Cuerpo interior serigrafiado */}
              <path
                ref={strapBodyRef}
                d={INITIAL_STRAP_D}
                fill="none"
                stroke="#242424"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Costuras decorativas */}
              <path
                ref={strapStitchRef}
                d={INITIAL_STRAP_D}
                fill="none"
                stroke="#52525b"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Texto blanco 'DEV #777' serigrafiado a lo largo de la curva de la cinta */}
              <text className="select-none font-mono text-[9px] font-bold fill-neutral-300 tracking-[0.22em] opacity-90">
                <textPath href="#lanyard-curve" startOffset="48%" textAnchor="middle">
                  3D CARD • DEV #777
                </textPath>
              </text>
            </svg>

            {/* Carnet y Gancho Arrastrables:
                - transformOrigin: 'top center' para que la rotación pivote exactamente en el clip
                - El clip se mantiene 100% sincronizado con el extremo de la cinta en tiempo real a 120 FPS
            */}
            <motion.div
              drag
              dragElastic={0.2}
              dragConstraints={{ left: -160, right: 160, top: -70, bottom: 180 }}
              onDragEnd={handleDragEnd}
              style={{
                x,
                y,
                rotate: dragRotate,
                transformOrigin: 'top center',
                top: `${BASE_BADGE_Y}px`,
              }}
              whileHover={{ cursor: 'grab' }}
              whileDrag={{ cursor: 'grabbing' }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center select-none touch-none z-20"
            >
              {/* Gancho y clip metálico: El pivote superior que recibe la cinta de forma continua */}
              <div className="relative z-30 flex flex-col items-center pointer-events-none">
                {/* Abrazadera metálica donde entra la cinta: manga metálica sólida que cubre y oculta el extremo */}
                <div className="relative h-6 w-8 bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-400 rounded-xs shadow-md border border-neutral-400/90 flex flex-col items-center justify-between py-1">
                  {/* Ranura oscura superior simulando la abertura por donde entra la cinta */}
                  <div className="h-1 w-6 bg-neutral-900 rounded-full shadow-inner" />
                  {/* Remache metálico central de sujeción */}
                  <div className="h-2 w-2 rounded-full bg-neutral-500 border border-neutral-300 shadow-inner" />
                </div>
                {/* Aro metálico que pasa directamente por la ranura del carnet */}
                <div className="h-4.5 w-3 rounded-full border-2 border-neutral-400 bg-transparent -mt-1 shadow-xs" />
              </div>

              {/* Tarjeta de Identificación / ID Badge */}
              <div className="relative -mt-1 w-64 sm:w-72 rounded-3xl border-4 border-white bg-white p-3.5 shadow-2xl shadow-black/45 dark:border-neutral-700 dark:bg-neutral-900 transition-shadow">
                {/* Ranura superior del porta-carnet para el gancho */}
                <div className="mx-auto mb-3 h-2.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700 shadow-inner" />

                {/* Foto a color normal - NO arrastra fantasma, permite arrastrar el carnet completo */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-inner select-none pointer-events-none">
                  <Image
                    src="/images/FotoPerfil.png"
                    alt={profile.name}
                    fill
                    priority
                    draggable={false}
                    sizes="(max-width: 640px) 256px, 288px"
                    className="object-cover object-top select-none pointer-events-none"
                    style={{ userSelect: 'none' }}
                  />

                  {/* Gradiente inferior con datos del perfil en el carnet */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                    <p className="text-base font-extrabold tracking-tight">{profile.name} E. Vergara</p>
                    <p className="text-xs text-neutral-300 font-mono">Full-stack Developer</p>
                  </div>
                </div>

                {/* Pie del carnet con código y chip simulado */}
                <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                  <span>COLOMBIA • 2026</span>
                  <span className="h-2 w-8 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
                  <span>DEV-ID: #777</span>
                </div>
              </div>

              {/* Indicador para arrastrar */}
              <span className="mt-3 text-[11px] font-mono text-neutral-400 opacity-60 hover:opacity-100 transition pointer-events-none">
                ✦ ¡Arrastra el carnet con el cursor!
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}