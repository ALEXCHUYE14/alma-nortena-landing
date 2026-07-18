-- ============================================================
-- ALMA NORTEÑA · Esquema de base de datos
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
    'Aretes Dormilona de Filigrana',
    'Aretes clásicos de filigrana de plata 950, tejidos a mano por orfebres de Catacaos. La joya insignia del norte.',
    189.00,
    'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80',
    'Joyería',
    3
  ),
  (
    'Collar Hilo de Plata Trenzado',
    'Collar fino de plata 950 con dije central en granetería, ideal para looks de día y de noche.',
    249.00,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Joyería',
    12
  ),
  (
    'Vestido Brisa Piurana',
    'Vestido midi de algodón pima, corte fluido y fresco, perfecto para el clima cálido de Piura.',
    159.90,
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    'Moda',
    18
  ),
  (
    'Sombrero de Paja Toquilla',
    'Sombrero tejido a mano con paja toquilla de Catacaos, ala media y cinta color tierra.',
    139.00,
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    'Accesorios',
    5
  ),
  (
    'Pulsera Filigrana Flor de Algarrobo',
    'Pulsera artesanal de plata 950 con eslabones en forma de flor, inspirada en el bosque seco piurano.',
    169.00,
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'Joyería',
    8
  ),
  (
    'Blusa Atardecer de Sechura',
    'Blusa ligera en tonos arena y terracota con bordado artesanal en el escote.',
    89.90,
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
    'Moda',
    22
  ),
  (
    'Bolso Tejido Catacaos',
    'Bolso de mano tejido en fibra natural con asas de cuero y forro interior de tela.',
    119.00,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    'Accesorios',
    4
  ),
  (
    'Anillo Corona de Filigrana',
    'Anillo de plata 950 con trabajo de filigrana en espiral, ajustable y hecho a pedido.',
    129.00,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Joyería',
    15
  )
on conflict do nothing;
