import React from 'react';
import Image from 'next/image';

export function TechIcon({
  name,
  alt,
  size = 18,
  className = '',
}: {
  name: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={`/icons/${name}`}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain ${className}`}
      unoptimized
    />
  );
}

export function GithubIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icons/github.svg"
      alt="GitHub"
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain dark:invert ${className}`}
      unoptimized
    />
  );
}

export function LinkedinIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icons/linkedin.svg"
      alt="LinkedIn"
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain ${className}`}
      unoptimized
    />
  );
}

export function BitbucketIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icons/bitbucket.svg"
      alt="Bitbucket"
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain ${className}`}
      unoptimized
    />
  );
}

/**
 * Returns the exact official vector icon for each skill / stack technology
 */
export function getTechIcon(name: string, size = 16) {
  const n = name.toLowerCase().trim();

  if (n.includes('bitbucket')) {
    return <TechIcon name="bitbucket.svg" alt="Bitbucket" size={size} />;
  }
  if (n.includes('angular material')) {
    return <TechIcon name="angular.svg" alt="Angular Material" size={size} />;
  }
  if (n.includes('angular')) {
    return <TechIcon name="angular.svg" alt="Angular" size={size} />;
  }
  if (n.includes('typescript')) {
    return <TechIcon name="typescript.svg" alt="TypeScript" size={size} />;
  }
  if (n.includes('react')) {
    return <TechIcon name="react.svg" alt="React" size={size} />;
  }
  if (n.includes('next')) {
    return <TechIcon name="nextdotjs.svg" alt="Next.js" size={size} className="dark:invert" />;
  }
  if (n.includes('tailwind')) {
    return <TechIcon name="tailwindcss.svg" alt="Tailwind CSS" size={size} />;
  }
  if (n.includes('spring')) {
    return <TechIcon name="spring.svg" alt="Spring Boot" size={size} />;
  }
  if (n.includes('java')) {
    return <TechIcon name="java.svg" alt="Java" size={size} />;
  }
  if (n.includes('docker')) {
    return <TechIcon name="docker.svg" alt="Docker" size={size} />;
  }
  if (n.includes('git')) {
    return <TechIcon name="git.svg" alt="Git" size={size} />;
  }
  if (n.includes('mysql')) {
    return <TechIcon name="mysql.svg" alt="MySQL" size={size} />;
  }
  if (n.includes('laravel') || n.includes('php') || n.includes('filament')) {
    return <TechIcon name="laravel.svg" alt="Laravel" size={size} />;
  }
  if (n.includes('jenkins')) {
    return <TechIcon name="jenkins.svg" alt="Jenkins" size={size} />;
  }
  if (n.includes('oci') || n.includes('oracle') || n.includes('cloud') || n.includes('eureka') || n.includes('gateway')) {
    return <TechIcon name="oracle.svg" alt="Oracle Cloud" size={size} />;
  }

  return null;
}
