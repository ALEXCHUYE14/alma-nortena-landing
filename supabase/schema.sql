-- ============================================================
-- GRC BISUTERÍA · Esquema de base de datos
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Extensión para generar UUIDs (viene habilitada en Supabase,
-- se declara por idempotencia)
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABLA: productos
-- ============================================================
create table if not exists public.productos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text not null default '',
  precio      numeric(10, 2) not null check (precio >= 0),
  imagen_url  text not null,
  categoria   text not null,
  stock       int not null default 0 check (stock >= 0),
  created_at  timestamptz not null default now()
);

comment on table public.productos is
  'Catálogo público de productos de la boutique.';

create index if not exists idx_productos_categoria
  on public.productos (categoria);

create index if not exists idx_productos_created_at
  on public.productos (created_at desc);

-- ============================================================
-- 2. TABLA: leads_suscritos
-- ============================================================
create table if not exists public.leads_suscritos (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  distrito   text not null check (
    distrito in ('Piura', 'Catacaos', 'Castilla', 'Veintiséis de Octubre')
  ),
  created_at timestamptz not null default now()
);

comment on table public.leads_suscritos is
  'Suscriptores del boletín. Solo INSERT público; lectura restringida.';

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================
alter table public.productos       enable row level security;
alter table public.leads_suscritos enable row level security;

-- --- productos: lectura pública, sin escritura anónima -------
drop policy if exists "lectura_publica_productos" on public.productos;
create policy "lectura_publica_productos"
  on public.productos
  for select
  to anon, authenticated
  using (true);

-- (No se crean políticas de INSERT/UPDATE/DELETE: con RLS activo
--  y sin política, esas operaciones quedan denegadas para anon.
--  La gestión del catálogo se hace con la service_role key desde
--  el dashboard o un panel administrativo.)

-- --- leads_suscritos: solo inserción pública -----------------
drop policy if exists "insercion_publica_leads" on public.leads_suscritos;
create policy "insercion_publica_leads"
  on public.leads_suscritos
  for insert
  to anon, authenticated
  with check (true);

-- IMPORTANTE: no existe política de SELECT para leads_suscritos.
-- Con RLS habilitado, ningún cliente anónimo puede leer los
-- correos registrados: la privacidad queda protegida a nivel
-- de base de datos, no solo de aplicación.

-- ============================================================
-- 4. DATOS DE EJEMPLO (seed)
-- ============================================================
insert into public.productos (nombre, descripcion, precio, imagen_url, categoria, stock)
values
  (
    'Aretes Luna Minimalista',
    'Aretes pequeños en baño dorado, diseño minimalista para uso diario.',
    22.90,
    'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80',
    'Aretes',
    18
  ),
  (
    'Collar Cadena Fina Dorada',
    'Collar de cadena fina con dije delicado, ideal para combinar en capas.',
    28.90,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Collares',
    15
  ),
  (
    'Set Aretes + Collar Combinado',
    'Set combinado de aretes y collar a juego, listo para regalar.',
    39.90,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Sets',
    10
  ),
  (
    'Diadema Trendy Escolar',
    'Diadema de moda en tonos pastel, perfecta para el colegio o el diario.',
    15.90,
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    'Accesorios',
    25
  ),
  (
    'Pulsera Charms Boho',
    'Pulsera ajustable con dijes boho, combina con cualquier look casual.',
    18.90,
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'Pulseras',
    20
  ),
  (
    'Aretes Argolla Dorada',
    'Argollas medianas bañadas en oro, versátiles para el día o la noche.',
    24.90,
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
    'Aretes',
    16
  ),
  (
    'Collar Choker Moderno',
    'Choker corto de estilo moderno, tendencia para looks de oficina y eventos.',
    26.90,
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    'Collares',
    12
  ),
  (
    'Set Escolar Trendy',
    'Set de accesorios pensado para el colegio: pulsera, aretes y scrunchie a juego.',
    32.90,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    'Sets',
    14
  )
on conflict do nothing;
