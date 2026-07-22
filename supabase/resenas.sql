
-- ============================================================
-- GRC BISUTERÍA · Reseñas y calificaciones de producto
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- (mismo flujo que supabase/schema.sql)
-- ============================================================

create table if not exists public.resenas (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references public.productos (id) on delete cascade,
  nombre       text not null,
  calificacion int not null check (calificacion between 1 and 5),
  comentario   text not null default '',
  -- Moderación: una reseña nueva no es pública hasta que se apruebe
  -- manualmente (Supabase Dashboard → Table Editor → resenas →
  -- cambiar "aprobado" a true). Evita publicar spam automáticamente.
  aprobado     boolean not null default false,
  created_at   timestamptz not null default now()
);

comment on table public.resenas is
  'Reseñas de clientas por producto. Solo se muestran públicamente las que tienen aprobado = true.';

create index if not exists idx_resenas_producto_id
  on public.resenas (producto_id);

create index if not exists idx_resenas_aprobado
  on public.resenas (aprobado);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.resenas enable row level security;

-- --- lectura pública: solo reseñas aprobadas -----------------
drop policy if exists "lectura_publica_resenas_aprobadas" on public.resenas;
create policy "lectura_publica_resenas_aprobadas"
  on public.resenas
  for select
  to anon, authenticated
  using (aprobado = true);

-- --- inserción pública: siempre entra como NO aprobada -------
-- El "with check" impide que alguien envíe una reseña ya
-- aprobada manipulando la petición directamente (RLS lo bloquea
-- a nivel de base de datos, no solo en la app).
drop policy if exists "insercion_publica_resenas" on public.resenas;
create policy "insercion_publica_resenas"
  on public.resenas
  for insert
  to anon, authenticated
  with check (aprobado = false);

-- IMPORTANTE: no existen políticas de UPDATE/DELETE para anon.
-- Aprobar, editar o borrar reseñas requiere la service_role key
-- desde el Dashboard, igual que la gestión del catálogo.
