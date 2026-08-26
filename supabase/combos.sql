-- ============================================================
-- GRC BISUTERÍA · Combos / Sets ("Arma tu set")
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- (mismo flujo que supabase/schema.sql)
-- ============================================================

create table if not exists public.combos (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  descripcion    text not null default '',
  -- IDs de productos reales incluidos en el set (sin tabla de unión:
  -- más simple de mantener para un catálogo chico como este).
  producto_ids   uuid[] not null check (array_length(producto_ids, 1) >= 2),
  precio_combo   numeric(10, 2) not null check (precio_combo >= 0),
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

comment on table public.combos is
  'Sets de 2+ productos a precio especial. Gestión (crear/editar/activar) solo desde el Dashboard.';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.combos enable row level security;

-- --- lectura pública: solo combos activos ----------------------
drop policy if exists "lectura_publica_combos_activos" on public.combos;
create policy "lectura_publica_combos_activos"
  on public.combos
  for select
  to anon, authenticated
  using (activo = true);

-- IMPORTANTE: no existen políticas de INSERT/UPDATE/DELETE para
-- anon. Crear, editar o activar/desactivar combos requiere la
-- service_role key desde el Dashboard, igual que el catálogo.

-- ============================================================
-- Combo de ejemplo (queda INACTIVO a propósito: el precio de
-- ejemplo no es una decisión que debamos tomar por ti — revísalo,
-- ajusta precio_combo a lo que realmente quieras ofrecer y cambia
-- "activo" a true desde el Table Editor cuando estés lista)
-- ============================================================
insert into public.combos (nombre, descripcion, producto_ids, precio_combo, activo)
select
  'Set Elegancia',
  'Aretes Statement Piedra Azul + Collar Luna y Cristal, combinados para un look completo.',
  array[
    (select id from public.productos where nombre = 'Aretes Statement Piedra Azul' limit 1),
    (select id from public.productos where nombre = 'Collar Luna y Cristal' limit 1)
  ],
  48.90,
  false
where exists (select 1 from public.productos where nombre = 'Aretes Statement Piedra Azul')
  and exists (select 1 from public.productos where nombre = 'Collar Luna y Cristal')
  and not exists (select 1 from public.combos where nombre = 'Set Elegancia');
