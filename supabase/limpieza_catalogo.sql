-- ============================================================
-- LIMPIEZA DEL CATÁLOGO — ejecútalo UNA SOLA VEZ en el SQL Editor
-- de tu proyecto de Supabase (Dashboard → SQL Editor).
--
-- Qué hace: borra TODOS los productos actuales (incluye los
-- productos viejos de "Alma Norteña" — vestidos, sombreros, bolsos,
-- blusas — y los de bisutería con imágenes que no coincidían con
-- el nombre) y carga de nuevo solo 8 productos verificados uno por
-- uno, en las 4 categorías que pediste: Aretes, Collares, Pulseras
-- y Anillos.
--
-- ⚠️  Es destructivo: si ya agregaste tus propios productos reales
-- desde el Dashboard, revísalos primero con el SELECT de abajo
-- antes de borrar, para no perderlos.
-- ============================================================

-- Paso 0 (opcional, recomendado): revisa qué hay antes de borrar.
-- select id, nombre, categoria, imagen_url from public.productos;

-- Paso 1: vacía el catálogo actual.
delete from public.productos;

-- Paso 2: asegúrate de tener la columna de descuento (no falla si ya existe).
alter table public.productos
  add column if not exists precio_original numeric(10, 2);

-- Paso 3: carga el catálogo verificado (mismo bloque que supabase/schema.sql).
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
  );
