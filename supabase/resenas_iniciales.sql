-- ============================================================
-- GRC BISUTERÍA · Primeras reseñas reales (clientas contactadas
-- por WhatsApp por el negocio)
-- Ejecutar UNA SOLA VEZ en: Supabase Dashboard → SQL Editor
-- Requiere haber ejecutado antes supabase/resenas.sql
--
-- Se insertan ya con aprobado = true: el formulario público (RLS)
-- no permite auto-aprobarse una reseña, así que esa parte solo se
-- puede hacer desde aquí, con las credenciales del dueño del proyecto.
-- Los producto_id son los reales del catálogo en Supabase.
-- ============================================================

insert into public.resenas (producto_id, nombre, calificacion, comentario, aprobado)
values
  (
    'dea4d9c9-57bc-4bf7-a972-980fc16536ca', -- Collar Luna y Cristal
    'Camila R.',
    5,
    'Me encantó la atención. Tenía dudas sobre las medidas de un collar y me respondieron al toque por WhatsApp. El envío a provincia llegó súper rápido y los accesorios vienen muy bien empaquetados. 100% recomendado.',
    true
  ),
  (
    'cf5ee5cd-c316-443d-979b-01567b5e04d2', -- Pulsera Infinito Dorada
    'Lucía M.',
    5,
    'Compré unas pulseras para el cumpleaños de mi hermana y le fascinaron. La calidad se nota desde que abres el empaque, los acabados son impecables y los diseños se ven aun mejor en persona que en la página.',
    true
  ),
  (
    '77fcefd5-94e0-40a2-97f4-6577894d3d27', -- Aretes Statement Piedra Azul
    'Valeria G.',
    4,
    'La página es súper fácil de navegar y el catálogo está muy bonito. Hice mi pedido directo por WhatsApp y todo el proceso fue bastante ágil. Sin duda volveré a comprar.',
    true
  ),
  (
    '279f2513-39ce-4054-a011-fda5ec1a13e0', -- Anillo Halo Cristal
    'Diego S.',
    5,
    'Estaba buscando un regalo de aniversario a última hora y me salvaron. Me asesoraron súper bien por el chat y el detalle le encantó a mi novia. Excelente servicio.',
    true
  ),
  (
    '41021ebe-e0ac-470a-800f-58eb96e0ff56', -- Pulsera Cadena Gruesa
    'Andrea P.',
    5,
    'Los productos tienen muy buena terminación y no se despintan fácil. Me gustó mucho la variedad de estilos que tienen en la web. La relación calidad-precio vale totalmente la pena.',
    true
  ),
  (
    '12376e4e-f89a-448f-ad55-ab83d5081229', -- Collar Dije Martillado
    'Mariana T.',
    5,
    'Primera vez que pido por la web y la experiencia fue de 10. Todo muy transparente con el pago y el seguimiento de la entrega. Los accesorios son tal cual las fotos.',
    true
  )
on conflict do nothing;
