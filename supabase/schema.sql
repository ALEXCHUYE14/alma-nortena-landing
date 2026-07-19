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
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  descripcion     text not null default '',
  precio          numeric(10, 2) not null check (precio >= 0),
  precio_original numeric(10, 2) check (precio_original is null or precio_original >= 0),
  imagen_url      text not null,
  categoria       text not null,
  stock           int not null default 0 check (stock >= 0),
  created_at      timestamptz not null default now()
);

-- Si la tabla ya existía (proyecto en producción), agrega la columna
-- nueva sin perder los productos ya cargados. Es seguro re-ejecutar.
alter table public.productos
  add column if not exists precio_original numeric(10, 2);

comment on table public.productos is
  'Catálogo público de productos de la boutique.';

comment on column public.productos.precio_original is
  'Precio "antes" opcional. Solo se muestra descuento si es mayor que "precio".';

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
-- Catálogo acotado a 4 categorías (a pedido del negocio): Aretes,
-- Collares, Pulseras y Anillos. Cada imagen fue verificada uno a uno
-- para que coincida realmente con el producto (no son genéricas).
insert into public.productos (nombre, descripcion, precio, precio_original, imagen_url, categoria, stock)
values
  (
    'Aretes Statement Piedra Azul',
    'Aretes largos con piedra azul y cristales, para looks de fiesta o evento.',
    24.90,
    34.90,
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    'Aretes',
    18
  ),
  (
    'Aretes Argolla Dorada',
    'Argollas medianas bañadas en oro, versátiles para el día o la noche.',
    19.90,
    null,
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    'Aretes',
    16
  ),
  (
    'Collar Luna y Cristal',
    'Collar doble capa con dije de luna y cristal, ideal para combinar en capas.',
    28.90,
    null,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Collares',
    15
  ),
  (
    'Collar Dije Martillado',
    'Collar de cadena fina con dije martillado en acabado dorado.',
    26.90,
    36.90,
    'https://images.unsplash.com/photo-1605201206717-cb9eca0d2eb2?w=800&q=80',
    'Collares',
    12
  ),
  (
    'Pulsera Infinito Dorada',
    'Pulsera rígida con diseño de infinitos y baño dorado brillante.',
    18.90,
    24.90,
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'Pulseras',
    20
  ),
  (
    'Pulsera Cadena Gruesa',
    'Pulsera de cadena gruesa estilo statement, tendencia de temporada.',
    21.90,
    null,
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    'Pulseras',
    14
  ),
  (
    'Anillo Halo Cristal',
    'Anillo ajustable con cristal central rodeado de circonias, acabado bicolor.',
    17.90,
    null,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Anillos',
    22
  ),
  (
    'Anillo Serpiente Dorado',
    'Anillo texturizado diseño serpiente, baño dorado, ajustable.',
    19.90,
    27.90,
    'https://images.unsplash.com/photo-1677466891347-2ff8dad2f993?w=800&q=80',
    'Anillos',
    11
  )
on conflict do nothing;
