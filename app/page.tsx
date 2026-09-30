'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Projects } from '@/components/sections/projects';
import { Skills } from '@/components/sections/skills';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  const [welcomeDone, setWelcomeDone] = useState(false);

  return (
    <>
      <WelcomeScreen onFinished={() => setWelcomeDone(true)} />
      <Hero welcomeDone={welcomeDone} />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}