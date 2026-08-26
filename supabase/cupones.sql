-- ============================================================
-- GRC BISUTERÍA · Cupones de descuento
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- (mismo flujo que supabase/schema.sql)
-- ============================================================

create table if not exists public.cupones (
  id                uuid primary key default gen_random_uuid(),
  codigo            text not null unique,
  tipo              text not null check (tipo in ('porcentaje', 'monto_fijo')),
  valor             numeric(10, 2) not null check (
                      valor > 0 and (tipo <> 'porcentaje' or valor <= 100)
                    ),
  activo            boolean not null default true,
  -- null = sin fecha de vencimiento
  fecha_expiracion  timestamptz,
  created_at        timestamptz not null default now()
);

comment on table public.cupones is
  'Cupones de descuento aplicables en el checkout. Gestión (crear/editar/desactivar) solo desde el Dashboard.';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.cupones enable row level security;

-- --- lectura pública: solo cupones activos ---------------------
-- (necesario para que el checkout pueda validar el código que
-- escribe la clienta; no expone los que ya desactivaste)
drop policy if exists "lectura_publica_cupones_activos" on public.cupones;
create policy "lectura_publica_cupones_activos"
  on public.cupones
  for select
  to anon, authenticated
  using (activo = true);

-- IMPORTANTE: no existen políticas de INSERT/UPDATE/DELETE para
-- anon. Crear, editar o desactivar cupones requiere la service_role
-- key desde el Dashboard, igual que la gestión del catálogo.

-- ============================================================
-- Cupón de ejemplo (bórralo o cámbialo desde el Table Editor
-- cuando quieras lanzar tu propia promoción)
-- ============================================================
insert into public.cupones (codigo, tipo, valor, activo)
values ('BIENVENIDA10', 'porcentaje', 10, true)
on conflict (codigo) do nothing;
