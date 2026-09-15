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
  );
