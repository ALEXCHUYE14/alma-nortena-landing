"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck } from "lucide-react";

const MENSAJES = [
  "Envío gratis el mismo día en Piura Metropolitana",
  "Paga fácil con Yape, Plin o transferencia",
  "Pedidos y atención directa por WhatsApp",
];

export function AnnouncementBar() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndice((i) => (i + 1) % MENSAJES.length),
      4000
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative z-50 flex h-9 items-center justify-center overflow-hidden bg-stone-900 px-4 text-stone-50">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
        <Truck size={13} className="text-yellow-600" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.span
            key={indice}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {MENSAJES[indice]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
