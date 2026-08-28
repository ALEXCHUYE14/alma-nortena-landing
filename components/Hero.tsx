"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, Truck } from "lucide-react";
import { siteConfig, urlWhatsApp } from "@/lib/config";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";

const aparecer = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

// Video verificado (joyería real en primer plano) de Pexels, libre de
// regalías para uso comercial. La imagen sirve de poster/respaldo
// mientras el video carga o si el navegador no puede reproducirlo.
const VIDEO_PORTADA =
  "https://videos.pexels.com/video-files/5815082/5815082-hd_1920_1080_25fps.mp4";
const POSTER_PORTADA =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80";

export function Hero() {
  // Respeta la preferencia de movimiento reducido: en vez del video en
  // loop se muestra la imagen fija (misma escena, sin animación).
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducirMovimiento(consulta.matches);
    const escuchar = (e: MediaQueryListEvent) => setReducirMovimiento(e.matches);
    consulta.addEventListener("change", escuchar);
    return () => consulta.removeEventListener("change", escuchar);
  }, []);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-24 lg:pt-16">
      <div className="absolute inset-0 -z-20 bg-stone-900">
        {reducirMovimiento ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_PORTADA}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={POSTER_PORTADA}
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            <source src={VIDEO_PORTADA} type="video/mp4" />
          </video>
        )}
      </div>
      {/* Degradado oscuro para que el texto blanco sea legible sobre
          cualquier fotograma del video */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-900/85 via-stone-900/55 to-stone-900/40" />

      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="inline-flex items-center gap-2 rounded-full border border-yellow-600/40 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-yellow-500 backdrop-blur-sm"
        >
          <Sparkles size={13} aria-hidden="true" className="text-yellow-500" />
          Bisutería con esencia piurana
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] text-stone-50 sm:text-5xl lg:text-6xl"
        >
          Elegancia,{" "}
          <span className="font-[family-name:var(--font-script)] font-normal italic text-yellow-500">
            sin complicaciones
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-stone-100/85 sm:text-lg"
        >
          Aretes, collares, pulseras y sets combinados pensados para el
          diario, la oficina, el colegio y esos eventos que quieres lucir
          distinta. Bisutería moderna y accesible para la mujer real.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <a
            href="#coleccion"
            className="inline-flex items-center justify-center rounded-full bg-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 shadow-lg shadow-black/30 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
          >
            Ver colección
          </a>
          <a
            href={urlWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-50/70 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/10"
          >
            <IconoWhatsApp size={18} />
            Hablar con una asesora
          </a>
        </motion.div>

        <motion.a
          href={siteConfig.catalogoPdf}
          download
          custom={4}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-stone-100/90 underline underline-offset-4 transition-colors hover:text-yellow-500"
        >
          <Download size={15} aria-hidden="true" />
          Descargar catálogo completo (PDF)
        </motion.a>

        <motion.p
          custom={5}
          initial="hidden"
          animate="visible"
          variants={aparecer}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-100/80"
        >
          <Truck size={16} className="text-yellow-500" aria-hidden="true" />
          Envío gratis el mismo día en Piura, Castilla y Catacaos
        </motion.p>
      </div>

      {/* Sello dorado, mismo detalle de marca que la versión anterior */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 16 }}
        className="absolute bottom-6 right-6 hidden h-24 w-24 items-center justify-center rounded-full bg-yellow-600 text-center shadow-lg sm:flex lg:h-28 lg:w-28"
      >
        <span className="px-2 font-[family-name:var(--font-script)] text-base leading-tight text-stone-900 lg:text-lg">
          Esencia Piurana
        </span>
      </motion.div>
    </section>
  );
}
