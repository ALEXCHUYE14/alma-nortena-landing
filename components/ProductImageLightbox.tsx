"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ProductImageLightboxProps {
  src: string;
  alt: string;
  badge?: ReactNode;
}

export function ProductImageLightbox({ src, alt, badge }: ProductImageLightboxProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label={`Ampliar imagen de ${alt}`}
        className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-stone-100"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-sm transition-colors group-hover:bg-white">
          <ZoomIn size={16} aria-hidden="true" />
        </span>
      </button>

      <AnimatePresence>
        {abierto && (
          <>
            <motion.button
              key="lightbox-overlay"
              type="button"
              aria-label="Cerrar imagen ampliada"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAbierto(false)}
              className="fixed inset-0 z-[75] bg-stone-900/90 backdrop-blur-sm"
            />
            <motion.div
              key="lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-4 z-[75] flex items-center justify-center sm:inset-10"
            >
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="absolute right-0 top-0 z-10 rounded-full bg-white/90 p-2 text-stone-900 shadow-sm hover:bg-white sm:-right-2 sm:-top-2"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
