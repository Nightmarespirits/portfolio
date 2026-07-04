create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text not null,
  bio text not null,
  location text,
  email text,
  avatar_url text,
  avatar_storage_path text,
  cv_url text,
  cv_storage_path text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  tech_stack text[] default '{}'::text[] not null,
  image_url text,
  image_storage_path text,
  live_url text,
  repo_url text,
  sort_order integer default 0 not null,
  is_visible boolean default true not null,
  is_featured boolean default false not null,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.experience (
  id uuid default uuid_generate_v4() primary key,
  company text not null,
  role text not null,
  description text not null,
  start_date date,
  end_date date,
  location text,
  tech_used text[] default '{}'::text[] not null,
  sort_order integer default 0 not null,
  is_visible boolean default true not null,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  proficiency integer default 0 not null,
  sort_order integer default 0 not null,
  is_visible boolean default true not null,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.contact_links (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  url text not null,
  icon text not null,
  sort_order integer default 0 not null,
  is_visible boolean default true not null,
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  theme_mode text not null default 'dark' check (theme_mode in ('light', 'dark')),
  theme_preset text not null default 'cobalt' check (theme_preset in ('cobalt', 'azure', 'teal', 'emerald')),
  updated_at timestamptz default timezone('utc', now()) not null
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.contact_links enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Public projects are viewable by everyone" on public.projects;
drop policy if exists "Public experience is viewable by everyone" on public.experience;
drop policy if exists "Public skills are viewable by everyone" on public.skills;
drop policy if exists "Public contact_links are viewable by everyone" on public.contact_links;
drop policy if exists "Public site_settings are viewable by everyone" on public.site_settings;

create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Public projects are viewable by everyone" on public.projects for select using (true);
create policy "Public experience is viewable by everyone" on public.experience for select using (true);
create policy "Public skills are viewable by everyone" on public.skills for select using (true);
create policy "Public contact_links are viewable by everyone" on public.contact_links for select using (true);
create policy "Public site_settings are viewable by everyone" on public.site_settings for select using (true);

drop policy if exists "Authenticated users can manage profiles" on public.profiles;
drop policy if exists "Authenticated users can manage projects" on public.projects;
drop policy if exists "Authenticated users can manage experience" on public.experience;
drop policy if exists "Authenticated users can manage skills" on public.skills;
drop policy if exists "Authenticated users can manage contact links" on public.contact_links;
drop policy if exists "Authenticated users can manage site settings" on public.site_settings;

create policy "Authenticated users can manage profiles" on public.profiles for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage projects" on public.projects for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage experience" on public.experience for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage skills" on public.skills for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage contact links" on public.contact_links for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage site settings" on public.site_settings for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read portfolio assets" on storage.objects;
drop policy if exists "Authenticated can upload portfolio assets" on storage.objects;
drop policy if exists "Authenticated can update portfolio assets" on storage.objects;
drop policy if exists "Authenticated can delete portfolio assets" on storage.objects;

create policy "Public can read portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

create policy "Authenticated can upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets');

create policy "Authenticated can update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

create policy "Authenticated can delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets');

insert into public.site_settings (
  id,
  theme_mode,
  theme_preset
)
select
  1,
  'dark',
  'cobalt'
where not exists (select 1 from public.site_settings where id = 1);

insert into public.profiles (
  name,
  title,
  bio,
  location,
  email,
  seo_title,
  seo_description,
  seo_keywords
)
select
  'Clider Fernando Tutaya Rivera',
  'Ingeniero de Software Full Stack',
  'Desarrollador Full Stack especializado en soluciones escalables, arquitectura backend y experiencias digitales con criterio.',
  'Lima, Peru',
  'clidertutayarivera@gmail.com',
  'Clider Fernando - Software Engineer',
  'Portafolio profesional de Clider Fernando Tutaya Rivera con enfoque en backend, frontend y sistemas digitales de alto nivel.',
  'portfolio, software engineer, java, spring boot, react, next.js'
where not exists (select 1 from public.profiles);
