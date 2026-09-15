-- ============================================================
-- ACTUALIZAR FOTOS DE STOCK POR FOTOS REALES — ejecútalo en el
-- SQL Editor de tu proyecto de Supabase (Dashboard → SQL Editor).
--
-- Qué hace: reemplaza, uno por uno, cada foto de stock de Unsplash
-- del catálogo de ejemplo por una foto real del negocio (carpeta
-- public/grecia/ del proyecto). NO borra ni toca ningún producto:
-- cada UPDATE solo aplica a la fila que todavía tenga exactamente
-- esa URL de Unsplash, así que si ya reemplazaste algún producto
-- con tu propia foto, ese producto queda intacto.
--
-- Seguro de ejecutar más de una vez: si ya no queda ninguna fila
-- con la URL de Unsplash, el UPDATE simplemente no afecta filas.
-- ============================================================

update public.productos
set imagen_url = '/grecia/grecia-arete-corazon.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-arete-set-corazon.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-collar-cadenas.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-collar-corazon.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1605201206717-cb9eca0d2eb2?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-pulsera-medalla.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-pulsera-turquesa.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-anillo-mano.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80';

update public.productos
set imagen_url = '/grecia/grecia-anillos-variedad.jpeg'
where imagen_url = 'https://images.unsplash.com/photo-1677466891347-2ff8dad2f993?w=800&q=80';

-- Paso opcional: revisa el resultado.
-- select id, nombre, categoria, imagen_url from public.productos;
