import { Profile, ContactLink, Project, Experience, Skill, NavNode } from './types';

// ─── Navigation Nodes ──────────────────────────────────────────

export const NAV_NODES: NavNode[] = [
    { id: 'about', label: 'Perfil', sublabel: '01 — Identidad', gridArea: 'about' },
    { id: 'projects', label: 'Proyectos', sublabel: '02 — Obra', gridArea: 'projects' },
    { id: 'experience', label: 'Trayectoria', sublabel: '03 — Recorrido', gridArea: 'experience' },
    { id: 'skills', label: 'Dominio', sublabel: '04 — Competencias', gridArea: 'skills' },
    { id: 'contact', label: 'Contacto', sublabel: '05 — Conexión', gridArea: 'contact' },
];

// ─── Sample Profile ────────────────────────────────────────────

export const sampleProfile: Profile = {
    id: '1',
    name: 'Clider Fernando Tutaya Rivera',
    title: 'Ingeniero de Software Full Stack',
    bio: 'Desarrollador Full Stack especializado en la creación de soluciones informáticas escalables y centradas en el usuario. Combino una sólida base técnica en ecosistemas Java, Spring Boot y tecnologías frontend modernas como Vue.js y React para diseñar experiencias digitales eficientes y arquitecturas robustas que resuelven problemas del mundo real.',
    location: 'Lima, Perú',
    email: 'clidertutayarivera@gmail.com',
    avatar_url: '',
    cv_url: '#',
    seo_title: 'Clider Fernando — Software Engineer',
    seo_description: 'Portafolio profesional de Clider Fernando Tutaya Rivera. Ingeniero de Software Full Stack especializado en arquitecturas de backend con Spring Boot y frontend interactivo.',
    seo_keywords: 'desarrollador full stack, ingeniero de software, java, spring boot, vue.js, react, portfolio',
    updated_at: new Date().toISOString(),
};

// ─── Sample Contact Links ──────────────────────────────────────

export const sampleContactLinks: ContactLink[] = [
    { id: '1', label: 'GitHub', url: 'https://github.com/Nightmarespirits', icon: 'github', sort_order: 0, is_visible: true },
    { id: '2', label: 'LinkedIn', url: 'https://linkedin.com/in/clider-fernando-tutaya-rivera-987128300', icon: 'linkedin', sort_order: 1, is_visible: true },
    { id: '3', label: 'Email', url: 'mailto:clidertutayarivera@gmail.com', icon: 'email', sort_order: 2, is_visible: true },
];

// ─── Sample Projects ───────────────────────────────────────────

export const sampleProjects: Project[] = [
    {
        id: '1',
        title: 'Fit Agent: Asistente Nutricional con IA',
        slug: 'fit-agent-ia',
        description: 'Aplicación nativa móvil impulsada por inteligencia artificial para la generación de recomendaciones nutricionales personalizadas según el perfil físico del usuario.',
        long_description: 'Plataforma móvil integral orientada al sector fitness. Integra modelos de IA generativa para confeccionar recetas adaptadas a objetivos corporales específicos. Desarrollada para ecosistemas Android, iOS y Windows con un enfoque primordial en una experiencia de usuario fluida e intuitiva.',
        tech_stack: ['Mobile', 'AI', 'Android/iOS'],
        image_url: '',
        live_url: '',
        repo_url: 'https://github.com/Nightmarespirits/fit_agent',
        sort_order: 0,
        is_visible: true,
        is_featured: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Sistema de Gestión de Procesos',
        slug: 'sistema-gestion-procesos',
        description: 'Plataforma administrativa para la automatización y control centralizado de operaciones, optimizando el seguimiento de métricas clave y la eficiencia del negocio.',
        long_description: 'Arquitectura SPA enfocada en la modernización de negocios operativos (como lavanderías industriales). Incorpora dashboards en tiempo real, gestión de inventario, roles administrativos avanzados y un sistema ágil de generación de reportes.',
        tech_stack: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
        image_url: '',
        live_url: 'https://slcdemo.netlify.app/login',
        repo_url: 'https://github.com/Nightmarespirits/slc_Gestion_Operaciones',
        sort_order: 1,
        is_visible: true,
        is_featured: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Motor de Gestión de Archivos',
        slug: 'gestion-archivos',
        description: 'Solución corporativa optimizada para el rastreo, control y distribución segura de documentos, diseñada bajo arquitecturas orientadas a micro-operaciones.',
        long_description: 'Sistema empresarial desarrollado con Spring Boot y Vue.js. Su arquitectura robusta gestiona el ciclo de vida de los activos digitales asegurando accesos controlados (JWT, Spring Security) y operaciones automatizadas para corporaciones, facilitando el análisis y la toma de decisiones gerenciales.',
        tech_stack: ['Vue.js', 'Java', 'Spring Boot', 'MySQL', 'Docker'],
        image_url: '',
        live_url: 'https://gestorarchivos-demo.netlify.app/',
        repo_url: 'https://github.com/Nightmarespirits/Gestor_Archivos_Web',
        sort_order: 2,
        is_visible: true,
        is_featured: false,
        created_at: '2022-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Handmouse CV',
        slug: 'handmouse',
        description: 'Innovadora herramienta de visión computacional que reinterpreta gestos manuales capturados por cámara web en comandos tácticos y de ratón.',
        long_description: 'Desarrollada en Python utilizando OpenCV y modelos predictivos, esta aplicación redefine la interacción HCI (Human-Computer Interaction). Ofrece configuraciones de gestos personalizables optimizadas matemática y visualmente en tiempo real.',
        tech_stack: ['Python', 'Computer Vision', 'OpenCV', 'AI'],
        image_url: '',
        live_url: 'https://github.com/fernandotutaya/handmouse',
        repo_url: 'https://github.com/fernandotutaya/handmouse',
        sort_order: 3,
        is_visible: true,
        is_featured: false,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: new Date().toISOString(),
    }
];

// ─── Sample Experience ─────────────────────────────────────────

export const sampleExperience: Experience[] = [
    {
        id: '1',
        company: 'IESTPFFAA',
        role: 'Proyectos Académicos y Finalización de Estudios Técnicos',
        description: 'Culminación de la carrera técnica en Análisis de Sistemas. Desarrollo de arquitecturas orientadas a servicios, diseño de bases de datos relacionales y no relacionales, y despliegue de soluciones escalables empleando metodologías ágiles y continuous integration.',
        start_date: '2025-01-01',
        end_date: null,
        location: 'Lima, Perú',
        tech_used: ['Java', 'Spring Boot', 'Vue.js', 'Docker', 'Bases de Datos'],
        sort_order: 0,
        is_visible: true,
    },
    {
        id: '2',
        company: 'Programa de Prácticas',
        role: 'Desarrollador Trainee',
        description: 'Participación en células de desarrollo de software para integraciones funcionales. Ejecución de pruebas unitarias (JUnit, Jest), optimización de consultas SQL y refactorización de código base corporativo en el entorno de desarrollo y staging.',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        location: 'Lima, Perú',
        tech_used: ['Java', 'SQL', 'Git', 'Metodologías Ágiles', 'Testing'],
        sort_order: 1,
        is_visible: true,
    },
    {
        id: '3',
        company: 'Clientes Independientes',
        role: 'Desarrollador Full Stack (Freelance)',
        description: 'Toma de requerimientos, diseño de UX/UI preliminar y desarrollo end-to-end de aplicaciones web a medida. Implementación de APIs RESTful con Node.js y flujos frontend interactivos asegurando una alta retención de usuarios y eficiencia transaccional.',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        location: 'Remoto',
        tech_used: ['Node.js', 'Express', 'Vue.js', 'JavaScript'],
        sort_order: 2,
        is_visible: true,
    },
    {
        id: '4',
        company: 'IESTPFFAA',
        role: 'Estudiante de Análisis de Sistemas',
        description: 'Inicio de la formación académica enfocada en lógica de programación, algoritmos complejos y modelamiento de software estructurado.',
        start_date: '2022-03-01',
        end_date: '2023-12-31',
        location: 'Lima, Perú',
        tech_used: ['C++', 'Lógica Computacional', 'UML'],
        sort_order: 3,
        is_visible: true,
    }
];

// ─── Sample Skills ─────────────────────────────────────────────

export const sampleSkills: Skill[] = [
    // Backend
    { id: '1', name: 'Java', category: 'Backend & Core', proficiency: 92, sort_order: 0, is_visible: true },
    { id: '2', name: 'Spring Boot', category: 'Backend & Core', proficiency: 88, sort_order: 1, is_visible: true },
    { id: '3', name: 'Node.js / Express', category: 'Backend & Core', proficiency: 85, sort_order: 2, is_visible: true },
    { id: '4', name: 'Arquitectura REST / Microservicios', category: 'Backend & Core', proficiency: 90, sort_order: 3, is_visible: true },
    // Frontend
    { id: '5', name: 'JavaScript / ES6+', category: 'Frontend', proficiency: 88, sort_order: 0, is_visible: true },
    { id: '6', name: 'Vue.js', category: 'Frontend', proficiency: 85, sort_order: 1, is_visible: true },
    { id: '7', name: 'React / Next.js', category: 'Frontend', proficiency: 80, sort_order: 2, is_visible: true },
    { id: '8', name: 'CSS3 / SASS / Tailwind', category: 'Frontend', proficiency: 90, sort_order: 3, is_visible: true },
    // Database
    { id: '9', name: 'SQL (MySQL/PostgreSQL)', category: 'Bases de Datos', proficiency: 88, sort_order: 0, is_visible: true },
    { id: '10', name: 'MongoDB', category: 'Bases de Datos', proficiency: 82, sort_order: 1, is_visible: true },
    { id: '11', name: 'Diseño ORM/ODM', category: 'Bases de Datos', proficiency: 88, sort_order: 2, is_visible: true },
    // DevOps
    { id: '12', name: 'Git / GitHub Actions / CI/CD', category: 'DevOps & Herramientas', proficiency: 85, sort_order: 0, is_visible: true },
    { id: '13', name: 'Docker', category: 'DevOps & Herramientas', proficiency: 80, sort_order: 1, is_visible: true },
    { id: '14', name: 'Testing Automatizado (Jest/JUnit)', category: 'DevOps & Herramientas', proficiency: 85, sort_order: 2, is_visible: true },
];
