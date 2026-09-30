import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

import CursorWave from '@/components/CursorWave';

export const metadata: Metadata = {
  title: 'Luis E. Vergara | Full-stack Developer',
  description: 'Portafolio de Luis E. Vergara, desarrollador full-stack.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          {/* Fondo interactivo global CursorWave en toda la pantalla hasta el footer */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-85 dark:opacity-80">
            <CursorWave
              cellSize={42}
              influenceRadiusVmin={26}
              attackTime={0.35}
              releaseTime={0.55}
              idleScale={0.14}
              minPeakScale={0.7}
              maxPeakScale={1.2}
              burstSpeed={1100}
              burstThickness={140}
              backgroundColor="transparent"
              opacity={0.85}
              className="h-full w-full"
            />
          </div>

          <Header />
          <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

