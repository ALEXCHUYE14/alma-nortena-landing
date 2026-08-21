/**
 * Contenido de preguntas frecuentes. Vive en un módulo sin "use client"
 * a propósito: <FAQ /> (cliente) lo usa para renderizar el acordeón y
 * app/page.tsx (servidor) lo usa para el marcado FAQPage — un archivo
 * "use client" no puede exportar datos planos consumibles desde un
 * Server Component (sus exports quedan como referencias de cliente).
 */
export const PREGUNTAS = [
  {
    pregunta: "¿Cómo puedo pagar mi pedido?",
    respuesta:
      "Puedes pagar al instante escaneando nuestro QR de Yape desde el carrito, o coordinar Plin y transferencia bancaria (BCP / Interbank) directamente con tu asesora por WhatsApp.",
  },
  {
    pregunta: "¿Hacen envíos? ¿Tiene costo?",
    respuesta:
      "Sí, el envío es gratis el mismo día dentro de Piura, Castilla, Catacaos y Veintiséis de Octubre. Para otros distritos o ciudades escríbenos por WhatsApp y te confirmamos tiempos y costo.",
  },
  {
    pregunta: "¿Puedo cambiar o devolver una prenda o joya?",
    respuesta:
      "Sí, aceptamos cambios coordinando con tu asesora por WhatsApp, siempre que el producto conserve sus etiquetas y no haya sido usado. Escríbenos apenas recibas tu pedido si necesitas un cambio.",
  },
  {
    pregunta: "¿De qué materiales son las piezas?",
    respuesta:
      "Trabajamos con bisutería de buena calidad: aleaciones y baños duraderos, pensados para durar y cuidar tu piel. Cada producto indica su material específico en la descripción.",
  },
  {
    pregunta: "¿Cómo sé si un producto sigue disponible?",
    respuesta:
      "El stock se actualiza en tiempo real en la web. Si una pieza aparece como \"Agotado\" ya no está disponible; si dice \"Pocas unidades\" quedan muy pocas piezas.",
  },
  {
    pregunta: "¿Necesito crear una cuenta para comprar?",
    respuesta:
      "No es necesario. Puedes armar tu carrito y confirmar el pedido directo por WhatsApp. Crear una cuenta es opcional, solo para guardar tus favoritos más rápido en tu próxima visita.",
  },
  {
    pregunta: "¿Emiten boleta o factura?",
    respuesta:
      "Sí, emitimos boleta o factura electrónica para todos los pedidos. Indícale a tu asesora tus datos de facturación al confirmar la compra por WhatsApp.",
  },
  {
    pregunta: "¿Cómo cuido mi bisutería para que dure más?",
    respuesta:
      "Evita el contacto con perfume, agua y cremas, guárdala en un lugar seco separada de otras piezas, y sécala con un paño suave después de usarla. Así conservas su brillo por más tiempo.",
  },
] as const;
