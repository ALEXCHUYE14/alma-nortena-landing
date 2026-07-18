"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, Truck } from "lucide-react";
import { urlWhatsApp } from "@/lib/config";

const aparecer = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="textura-toquilla relative overflow-hidden pt-28 lg:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-24">
        {/* Columna de texto */}
        <div>
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={aparecer}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-600/40 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-amber-800"
          >
            <Sparkles size={13} aria-hidden="true" className="text-yellow-600" />
            Bisutería con esencia piurana
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={aparecer}
            className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] text-stone-900 sm:text-5xl lg:text-6xl"
          >
            Elegancia,{" "}
            <span className="font-[family-name:var(--font-script)] font-normal italic text-amber-800">
              sin complicaciones
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={aparecer}
            className="mt-5 max-w-lg text-base leading-relaxed text-stone-900/75 sm:text-lg"
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
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#coleccion"
              className="inline-flex items-center justify-center rounded-full bg-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 shadow-lg shadow-amber-800/20 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
            >
              Ver colección
            </a>
            <a
              href={urlWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-800 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-800/5"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Hablar con una asesora
            </a>
          </motion.div>

          <motion.p
            custom={4}
            initial="hidden"
            animate="visible"
            variants={aparecer}
            className="mt-6 inline-flex items-center gap-2 text-sm text-stone-900/70"
          >
            <Truck size={16} className="text-yellow-600" aria-hidden="true" />
            Envío gratis el mismo día en Piura, Castilla y Catacaos
          </motion.p>
        </div>

        {/* Composición asimétrica de imágenes */}
        <div className="relative mx-auto h-[420px] w-full max-w-md lg:h-[520px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute left-0 top-0 h-[72%] w-[68%] overflow-hidden rounded-[2rem] rounded-tr-[6rem] border-4 border-white shadow-xl shadow-amber-800/15"
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              alt="Mujer con vestido elegante de tonos cálidos"
              fill
              priority
              sizes="(min-width: 1024px) 380px, 68vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute bottom-0 right-0 h-[58%] w-[58%] overflow-hidden rounded-[2rem] rounded-bl-[6rem] border-4 border-white shadow-xl shadow-amber-800/15"
          >
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"
              alt="Bisutería moderna: aretes y accesorios de GRC"
              fill
              sizes="(min-width: 1024px) 320px, 58vw"
              className="object-cover"
            />
          </motion.div>

          {/* Sello dorado */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 16 }}
            className="absolute left-[52%] top-[58%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-600 text-center shadow-lg lg:h-28 lg:w-28"
          >
            <span className="px-2 font-[family-name:var(--font-script)] text-base leading-tight text-stone-900 lg:text-lg">
              Esencia Piurana
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
