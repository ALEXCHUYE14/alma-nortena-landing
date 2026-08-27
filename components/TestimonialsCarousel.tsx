"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export interface TestimonioSimple {
  id: string;
  nombre: string;
  calificacion: number;
  comentario: string;
  producto: string | null;
}

const INTERVALO_MS = 3000;

/**
 * Carrusel de reseñas: avanza sola cada 3s. Se pausa mientras el mouse
 * está encima o el foco está dentro (para no interrumpir la lectura ni
 * "pelear" con un teclado/lector de pantalla), y cualquier interacción
 * manual (flechas o puntos) reinicia el conteo desde cero.
 */
export function TestimonialsCarousel({ testimonios }: { testimonios: TestimonioSimple[] }) {
  const total = testimonios.length;
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Si la cantidad de reseñas cambiara entre renders (no debería, pero
  // por seguridad) evita quedar apuntando a un índice inexistente.
  useEffect(() => {
    if (indice >= total && total > 0) setIndice(0);
  }, [total, indice]);

  useEffect(() => {
    if (pausado || total <= 1) return;
    const id = setInterval(() => {
      setIndice((actual) => (actual + 1) % total);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado, total]);

  if (total === 0) return null;

  const actual = testimonios[indice];
  const irA = (nuevoIndice: number) => setIndice(((nuevoIndice % total) + total) % total);

  return (
    <div
      className="mx-auto max-w-2xl"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="relative flex items-center gap-3">
        {total > 1 && (
          <button
            type="button"
            onClick={() => irA(indice - 1)}
            aria-label="Reseña anterior"
            className="hidden shrink-0 rounded-full border border-amber-800/20 p-2 text-amber-800 transition-colors hover:bg-amber-800/5 sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-2xl border border-amber-800/15 bg-white p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait">
            <motion.figure
              key={actual.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex h-full flex-col"
            >
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={16}
                    className={n <= actual.calificacion ? "text-yellow-600" : "text-stone-200"}
                    fill={n <= actual.calificacion ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-stone-600 sm:text-base">
                &ldquo;{actual.comentario}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-stone-100 pt-4">
                <p className="text-sm font-semibold text-stone-900">{actual.nombre}</p>
                {actual.producto && (
                  <p className="text-xs text-stone-400">Compró: {actual.producto}</p>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => irA(indice + 1)}
            aria-label="Siguiente reseña"
            className="hidden shrink-0 rounded-full border border-amber-800/20 p-2 text-amber-800 transition-colors hover:bg-amber-800/5 sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {testimonios.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ver reseña ${i + 1} de ${total}`}
              aria-current={i === indice}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === indice ? "w-6 bg-amber-800" : "w-2 bg-amber-800/25 hover:bg-amber-800/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
