"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const PREGUNTAS = [
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
] as const;

function PreguntaItem({
  pregunta,
  respuesta,
  abierto,
  onToggle,
}: {
  pregunta: string;
  respuesta: string;
  abierto: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-amber-800/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-stone-900">{pregunta}</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-amber-800 transition-transform duration-300 ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-stone-500">
              {respuesta}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl">
      {PREGUNTAS.map((item, i) => (
        <PreguntaItem
          key={item.pregunta}
          pregunta={item.pregunta}
          respuesta={item.respuesta}
          abierto={indiceAbierto === i}
          onToggle={() => setIndiceAbierto(indiceAbierto === i ? null : i)}
        />
      ))}
    </div>
  );
}
