'use client';

import React, {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  useMemo,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export type CursorWaveShape = 'circle' | 'triangle' | 'square';
export type CursorWaveColor = string | { stops: [string, string] };

export interface CursorWaveHandle {
  burst: (x?: number, y?: number) => void;
}

export interface CursorWaveProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: ReactNode;
  cellSize?: number;
  influenceRadiusVmin?: number;
  attackTime?: number;
  releaseTime?: number;
  idleScale?: number;
  minPeakScale?: number;
  maxPeakScale?: number;
  burstSpeed?: number;
  burstThickness?: number;
  backgroundColor?: string;
  shapes?: CursorWaveShape[];
  colors?: CursorWaveColor[];
  dpr?: number;
  opacity?: number;
}

const DEFAULT_COLORS: CursorWaveColor[] = [
  '#22c55e',
  '#06b6d4',
  '#f97316',
  '#ef4444',
  '#facc15',
  '#ec4899',
  '#9ca3af',
  '#a78bfa',
  '#60a5fa',
  '#34d399',
  { stops: ['#6366f1', '#3b82f6'] },
  { stops: ['#06b6d4', '#6366f1'] },
  { stops: ['#22c55e', '#06b6d4'] },
  { stops: ['#f97316', '#ef4444'] },
  { stops: ['#8b5cf6', '#06b6d4'] },
  { stops: ['#3b82f6', '#8b5cf6'] },
  { stops: ['#34d399', '#3b82f6'] },
];

const DEFAULT_SHAPES: CursorWaveShape[] = ['circle', 'triangle', 'square'];
const TWO_PI = 2 * Math.PI;

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function easeParam(time: number) {
  return time <= 0 ? 1 : 1 - Math.pow(0.05, 1 / (60 * time));
}

interface Cell {
  x: number;
  y: number;
  shape: CursorWaveShape;
  color: CursorWaveColor;
  angle: number;
  size: number;
  scale: number;
  peak: number;
  hovered: boolean;
}

interface Ripple {
  x: number;
  y: number;
  start: number;
}

interface InternalState {
  cells: Cell[];
  ripples: Ripple[];
  pointer: { x: number; y: number } | null;
  pointerEnergy: number;
  maskRects: DOMRect[];
  maskFrame: number;
  suspendMasks: boolean;
  suspendMaskUntil: number;
  width: number;
  height: number;
  dpr: number;
  raf: number;
}

export const CursorWave = forwardRef<CursorWaveHandle, CursorWaveProps>(
  (
    {
      width = '100%',
      height = '100%',
      className,
      children,
      cellSize = 40,
      influenceRadiusVmin = 26,
      attackTime = 0.35,
      releaseTime = 0.55,
      idleScale = 0.14,
      minPeakScale = 0.7,
      maxPeakScale = 1.15,
      burstSpeed = 1100,
      burstThickness = 140,
      backgroundColor = 'transparent',
      shapes = DEFAULT_SHAPES,
      colors = DEFAULT_COLORS,
      dpr = 2,
      opacity = 0.85,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const stateRef = useRef<InternalState | null>(null);

    if (stateRef.current === null) {
      stateRef.current = {
        cells: [],
        ripples: [],
        pointer: null,
        pointerEnergy: 0,
        maskRects: [],
        maskFrame: 0,
        suspendMasks: false,
        suspendMaskUntil: 0,
        width: 0,
        height: 0,
        dpr: 1,
        raf: 0,
      };
    }

    const configRef = useRef({
      cellSize,
      influenceRadiusVmin,
      attackTime,
      releaseTime,
      idleScale,
      minPeakScale,
      maxPeakScale,
      burstSpeed,
      burstThickness,
      backgroundColor,
      shapes,
      colors,
      opacity,
    });

    useEffect(() => {
      configRef.current = {
        cellSize,
        influenceRadiusVmin,
        attackTime,
        releaseTime,
        idleScale,
        minPeakScale,
        maxPeakScale,
        burstSpeed,
        burstThickness,
        backgroundColor,
        shapes,
        colors,
        opacity,
      };
    }, [
      cellSize,
      influenceRadiusVmin,
      attackTime,
      releaseTime,
      idleScale,
      minPeakScale,
      maxPeakScale,
      burstSpeed,
      burstThickness,
      backgroundColor,
      shapes,
      colors,
      opacity,
    ]);

    const buildGrid = useCallback(() => {
      const state = stateRef.current;
      if (!state) return;
      const w = state.width;
      const h = state.height;
      const cfg = configRef.current;
      const cell = Math.max(cfg.cellSize, 4);
      const cols = Math.max(1, Math.floor(w / cell));
      const rows = Math.max(1, Math.floor(h / cell));
      const offsetX = (w - (cols - 1) * cell) / 2;
      const offsetY = (h - (rows - 1) * cell) / 2;
      const cells: Cell[] = [];
      const poolShapes = cfg.shapes.length > 0 ? cfg.shapes : DEFAULT_SHAPES;
      const poolColors = cfg.colors.length > 0 ? cfg.colors : DEFAULT_COLORS;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            x: offsetX + c * cell,
            y: offsetY + r * cell,
            shape: randomChoice(poolShapes),
            color: randomChoice(poolColors),
            angle: randomRange(0, TWO_PI),
            size: 0.28 * cell,
            scale: cfg.idleScale,
            peak: randomRange(cfg.minPeakScale, cfg.maxPeakScale),
            hovered: false,
          });
        }
      }
      state.cells = cells;
    }, []);

    const resize = useCallback(() => {
      const state = stateRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!state || !canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, Math.max(dpr, 1));

      canvas.width = w * pixelRatio;
      canvas.height = h * pixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(pixelRatio, pixelRatio);
      }

      state.width = w;
      state.height = h;
      state.dpr = pixelRatio;
      buildGrid();
    }, [buildGrid, dpr]);

    const burst = useCallback((clientX?: number, clientY?: number) => {
      const state = stateRef.current;
      const container = containerRef.current;
      if (!state || !container) return;

      let x: number;
      let y: number;
      if (clientX === undefined || clientY === undefined) {
        x = state.width / 2;
        y = state.height / 2;
      } else {
        const rect = container.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
      }

      state.ripples.push({ x, y, start: performance.now() });
      const maxDist = Math.sqrt(state.width * state.width + state.height * state.height);
      const duration = (maxDist / Math.max(configRef.current.burstSpeed, 1)) * 1000;
      state.suspendMasks = true;
      state.suspendMaskUntil = performance.now() + duration;
    }, []);

    useImperativeHandle(ref, () => ({ burst }), [burst]);

    useEffect(() => {
      const state = stateRef.current;
      if (!state) return;
      resize();

      const loop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cfg = configRef.current;
        const w = state.width;
        const h = state.height;
        const radius = Math.min(w, h) * (cfg.influenceRadiusVmin / 100);
        const now = performance.now();

        ctx.globalAlpha = 1;
        if (cfg.backgroundColor === 'transparent') {
          ctx.clearRect(0, 0, w, h);
        } else {
          ctx.fillStyle = cfg.backgroundColor;
          ctx.fillRect(0, 0, w, h);
        }

        state.pointerEnergy *= 0.93;
        state.maskFrame += 1;

        if (state.maskFrame % 10 === 0 && containerRef.current) {
          const masks = containerRef.current.querySelectorAll('[data-cursor-wave-mask]');
          const box = containerRef.current.getBoundingClientRect();
          const rects: DOMRect[] = [];
          masks.forEach((el) => {
            const r = el.getBoundingClientRect();
            rects.push(new DOMRect(r.left - box.left, r.top - box.top, r.width, r.height));
          });
          state.maskRects = rects;
        }

        if (state.suspendMasks && now >= state.suspendMaskUntil) {
          state.suspendMasks = false;
        }

        const maxDiag = Math.sqrt(w * w + h * h);
        state.ripples = state.ripples.filter(
          (rip) => ((now - rip.start) / 1000) * cfg.burstSpeed < maxDiag + cfg.burstThickness
        );

        const halfCell = 0.5 * cfg.cellSize;
        const attackEase = easeParam(cfg.attackTime);
        const releaseEase = easeParam(cfg.releaseTime);

        ctx.globalAlpha = cfg.opacity;

        for (let i = 0; i < state.cells.length; i++) {
          const cell = state.cells[i];
          let masked = false;

          if (!state.suspendMasks) {
            for (let m = 0; m < state.maskRects.length; m++) {
              const rect = state.maskRects[m];
              if (
                cell.x >= rect.left - halfCell &&
                cell.x <= rect.right + halfCell &&
                cell.y >= rect.top - halfCell &&
                cell.y <= rect.bottom + halfCell
              ) {
                masked = true;
                break;
              }
            }
          }

          if (masked) {
            cell.scale += (0 - cell.scale) * releaseEase;
            if (cell.scale < 0.005) cell.scale = 0;
            continue;
          }

          let pointerIntensity = 0;
          if (state.pointer && state.pointerEnergy > 0.001 && radius > 0) {
            const dx = cell.x - state.pointer.x;
            const dy = cell.y - state.pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const norm = 1 - dist / radius;
            const clamped = norm < 0 ? 0 : norm > 1 ? 1 : norm;
            const smooth = clamped * clamped * (3 - 2 * clamped);
            pointerIntensity = smooth * state.pointerEnergy;

            if (pointerIntensity > 0.05 && !cell.hovered) {
              cell.hovered = true;
              cell.peak = randomRange(cfg.minPeakScale, cfg.maxPeakScale);
              cell.angle = randomRange(0, TWO_PI);
            } else if (pointerIntensity <= 0.05) {
              cell.hovered = false;
            }
          } else {
            cell.hovered = false;
          }

          let rippleIntensity = 0;
          for (let r = 0; r < state.ripples.length; r++) {
            const rip = state.ripples[r];
            const distWave = ((now - rip.start) / 1000) * cfg.burstSpeed;
            const dx = cell.x - rip.x;
            const dy = cell.y - rip.y;
            const distCell = Math.sqrt(dx * dx + dy * dy);
            const waveDist = 1 - Math.abs(distCell - distWave) / cfg.burstThickness;
            if (waveDist > 0) {
              const waveVal = Math.sin(Math.PI * waveDist);
              if (waveVal > rippleIntensity) rippleIntensity = waveVal;
            }
          }

          const peakDiff = cell.peak - cfg.idleScale;
          const targetHover = cfg.idleScale + pointerIntensity * peakDiff;
          const targetRipple = cfg.idleScale + rippleIntensity * peakDiff;
          const targetScale = targetHover > targetRipple ? targetHover : targetRipple;
          const stepEase = targetScale > cell.scale ? attackEase : releaseEase;

          cell.scale += (targetScale - cell.scale) * stepEase;

          if (cell.scale < 0.15 * cfg.idleScale) continue;

          ctx.save();
          ctx.translate(cell.x, cell.y);
          ctx.rotate(cell.angle);
          ctx.scale(cell.scale, cell.scale);

          // Fill style
          if (typeof cell.color === 'string') {
            ctx.fillStyle = cell.color;
          } else {
            const grad = ctx.createRadialGradient(0, -0.3 * cell.size, 0, 0, 0.3 * cell.size, 1.5 * cell.size);
            grad.addColorStop(0, cell.color.stops[0]);
            grad.addColorStop(1, cell.color.stops[1]);
            ctx.fillStyle = grad;
          }

          // Draw shape
          switch (cell.shape) {
            case 'circle': {
              ctx.beginPath();
              ctx.arc(0, 0, 0.6 * cell.size, 0, TWO_PI);
              break;
            }
            case 'square': {
              const sz = 0.6 * cell.size;
              ctx.beginPath();
              if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(-sz, -sz, 2 * sz, 2 * sz, 0.12 * cell.size);
              } else {
                ctx.rect(-sz, -sz, 2 * sz, 2 * sz);
              }
              break;
            }
            case 'triangle': {
              const rad = 0.78 * cell.size;
              ctx.beginPath();
              for (let a = 0; a < 3; a++) {
                const angle = -Math.PI / 2 + (a * TWO_PI) / 3;
                const px = Math.cos(angle) * rad;
                const py = Math.sin(angle) * rad;
                if (a === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              break;
            }
          }

          ctx.fill();
          ctx.restore();
        }

        ctx.globalAlpha = 1;
        state.raf = requestAnimationFrame(loop);
      };

      state.raf = requestAnimationFrame(loop);

      let ro: ResizeObserver | null = null;
      const el = containerRef.current;
      if (el && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => resize());
        ro.observe(el);
      } else {
        window.addEventListener('resize', resize);
      }

      return () => {
        cancelAnimationFrame(state.raf);
        if (ro) ro.disconnect();
        else window.removeEventListener('resize', resize);
      };
    }, [resize]);

    const memoKey = useMemo(
      () => `${cellSize}|${shapes.join(',')}|${colors.length}`,
      [cellSize, shapes, colors]
    );

    useEffect(() => {
      buildGrid();
    }, [memoKey, buildGrid]);

    useEffect(() => {
      const handleWindowPointerMove = (e: PointerEvent) => {
        const state = stateRef.current;
        const container = containerRef.current;
        if (!state || !container) return;
        const rect = container.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          state.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          state.pointerEnergy = 1;
        } else if (state.pointer) {
          state.pointer = null;
        }
      };

      const handleWindowPointerDown = (e: PointerEvent) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          burst(e.clientX, e.clientY);
        }
      };

      window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
      window.addEventListener('pointerdown', handleWindowPointerDown, { passive: true });

      return () => {
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerdown', handleWindowPointerDown);
      };
    }, [burst]);

    return (
      <div
        ref={containerRef}
        className={cn('relative overflow-hidden', className)}
        style={{ width, height, backgroundColor }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />
        {children && (
          <div className="relative z-10 h-full w-full">{children}</div>
        )}
      </div>
    );
  }
);

CursorWave.displayName = 'CursorWave';
export default CursorWave;
