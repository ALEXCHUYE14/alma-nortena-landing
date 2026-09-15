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
-- Collares, Pulseras y Anillos. Fotos reales del negocio (carpeta
-- public/grecia/), no imágenes de stock ni genéricas.
insert into public.productos (nombre, descripcion, precio, precio_original, imagen_url, categoria, stock)
values
  (
    'Aretes Corazón Perlado',
    'Aretes en forma de corazón con acabado perlado y baño dorado, para looks de fiesta o evento.',
    24.90,
    34.90,
    '/grecia/grecia-arete-corazon.jpeg',
    'Aretes',
    18
  ),
  (
    'Set Aretes Corazón Rojo',
    'Set de aretes corazón rojo esmaltado a juego con anillo y pulsera, versátiles para el día o la noche.',
    19.90,
    null,
    '/grecia/grecia-arete-set-corazon.jpeg',
    'Aretes',
    16
  ),
  (
    'Collar Cadena Dorada',
    'Collar de cadena fina bañada en oro, ideal para combinar en capas.',
    28.90,
    null,
    '/grecia/grecia-collar-cadenas.jpeg',
    'Collares',
    15
  ),
  (
    'Collar Corazón Sagrado',
    'Collar con dije de corazón sagrado y detalle de piedras de colores, acabado dorado.',
    26.90,
    36.90,
    '/grecia/grecia-collar-corazon.jpeg',
    'Collares',
    12
  ),
  (
    'Pulsera Medalla Virgen',
    'Pulsera doble de piedras con dije de medalla, baño dorado brillante.',
    18.90,
    24.90,
    '/grecia/grecia-pulsera-medalla.jpeg',
    'Pulseras',
    20
  ),
  (
    'Pulsera Piedras Turquesa',
    'Pulseras de piedras naturales en tono turquesa con dijes dorados, tendencia de temporada.',
    21.90,
    null,
    '/grecia/grecia-pulsera-turquesa.jpeg',
    'Pulseras',
    14
  ),
  (
    'Anillo Cadena Dorado',
    'Anillo ajustable diseño cadena, baño dorado.',
    17.90,
    null,
    '/grecia/grecia-anillo-mano.jpeg',
    'Anillos',
    22
  ),
  (
    'Set Anillos Dorados',
    'Set de anillos apilables con diseños variados: infinito, flores, corazones y piedra, baño dorado.',
    19.90,
    27.90,
    '/grecia/grecia-anillos-variedad.jpeg',
    'Anillos',
    11
  )
on conflict do nothing;
