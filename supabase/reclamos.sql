-- ============================================================
-- GRC BISUTERÍA · Libro de Reclamaciones Virtual
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- (mismo flujo que supabase/schema.sql y supabase/resenas.sql)
--
-- Exigido por el Código de Protección y Defensa del Consumidor
-- (Ley N° 29571) y su reglamento del Libro de Reclamaciones para
-- proveedores que venden por internet en Perú.
-- ============================================================

create table if not exists public.reclamos (
  id                 uuid primary key default gen_random_uuid(),
  tipo               text not null check (tipo in ('Reclamo', 'Queja')),

  -- Datos del consumidor
  nombre_completo    text not null,
  tipo_documento     text not null,
  numero_documento   text not null,
  telefono           text not null,
  email              text not null,
  direccion          text not null default '',

  -- Datos del bien contratado
  producto_servicio  text not null,
  monto_reclamado    numeric(10, 2),

  -- Detalle
  descripcion        text not null,
  pedido             text not null,

  -- Seguimiento interno (solo editable desde el Dashboard con
  -- service_role, nunca desde el formulario público)
  estado             text not null default 'Pendiente'
                        check (estado in ('Pendiente', 'En proceso', 'Resuelto')),

  created_at         timestamptz not null default now()
);

comment on table public.reclamos is
  'Libro de Reclamaciones Virtual. Solo INSERT público; lectura y cambios de estado restringidos al negocio.';

create index if not exists idx_reclamos_created_at
  on public.reclamos (created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.reclamos enable row level security;

-- --- inserción pública: siempre entra como "Pendiente" -------
drop policy if exists "insercion_publica_reclamos" on public.reclamos;
create policy "insercion_publica_reclamos"
  on public.reclamos
  for insert
  to anon, authenticated
  with check (estado = 'Pendiente');

-- IMPORTANTE: no existen políticas de SELECT/UPDATE/DELETE para
-- anon. Los reclamos son datos personales del consumidor (Ley de
-- Protección de Datos Personales): solo el negocio, con la
-- service_role key desde el Dashboard, puede leerlos y darles
-- seguimiento.
