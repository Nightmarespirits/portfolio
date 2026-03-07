-- Habilitar extensión de UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Tabla Perfiles (profiles)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  location text,
  email text,
  avatar_url text,
  cv_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Tabla Proyectos (projects)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  long_description text,
  tech_stack text[] DEFAULT '{}'::text[],
  image_url text,
  live_url text,
  repo_url text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. Tabla Experiencia (experience)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.experience (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  company text NOT NULL,
  role text NOT NULL,
  description text NOT NULL,
  start_date date,
  end_date date,
  location text,
  tech_used text[] DEFAULT '{}'::text[],
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. Tabla Habilidades (skills)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  proficiency integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. Tabla Enlaces de Contacto (contact_links)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_links (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) para hacer estos datos de lectura publica.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_links ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura pública a cualquier usuario (incluso anónimos)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public contact_links are viewable by everyone" ON public.contact_links FOR SELECT USING (true);

-- Insertar un perfil por defecto basado en los datos proporcionados
INSERT INTO public.profiles (name, title, bio, location, email, seo_title, seo_description)
VALUES (
  'Clider Fernando Tutaya Rivera',
  'Ingeniero de Software Full Stack',
  'Desarrollador Full Stack especializado en la creación de soluciones informáticas escalables y centradas en el usuario. Combino una sólida base técnica en Java, Spring Boot y Vue.js con un fuerte enfoque en calidad, eficiencia y experiencia de usuario optimizada.',
  'Lima, Perú',
  'clidertutayarivera@gmail.com',
  'Clider Fernando Tutaya Rivera — Full Stack Developer',
  'Portafolio profesional de Clider Fernando, Ingeniero de Software Full Stack especializado en Java, Spring Boot y ecosistemas web modernos.'
) ON CONFLICT DO NOTHING;
