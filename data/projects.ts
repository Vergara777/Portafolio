export type Project = {
  title: string;
  description: string;
  role: string;
  stack: string[];
  href?: string;
  repo?: string;
  repoType?: 'github' | 'bitbucket';
};

// Proyectos reales con repositorios en GitHub y Bitbucket
export const projects: Project[] = [
  {
    title: 'FieldOps',
    description:
      'Aplicación web full-stack para gestión operativa y control de flujos de trabajo con frontend en Angular y microservicios en Spring Boot.',
    role: 'Desarrollo full-stack',
    stack: ['Angular', 'Spring Boot', 'TypeScript', 'MySQL'],
    repo: 'https://bitbucket.org/Vergara777/fieldops',
    repoType: 'bitbucket',
  },
  {
    title: 'Microservicio de correos',
    description:
      'Servicio independiente y desacoplado para el envío seguro de correos electrónicos transaccionales y notificaciones vía API REST.',
    role: 'Proyecto backend',
    stack: ['Spring Boot', 'Java', 'Docker', 'API REST'],
    repo: 'https://github.com/Vergara777/microservicio-correos',
    repoType: 'github',
  },
  {
    title: 'PharmaSoft',
    description:
      'Sistema de administración integral para farmacias con control de inventario y panel de gestión construido con Laravel, PHP y MySQL.',
    role: 'Desarrollo full-stack',
    stack: ['Laravel', 'Filament', 'PHP', 'MySQL'],
    repo: 'https://bitbucket.org/Vergara777/pharmasoft',
    repoType: 'bitbucket',
  },
];