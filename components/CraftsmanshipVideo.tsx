"use client";

import { useEffect, useState } from "react";
import { Gem } from "lucide-react";

// Video verificado (acabado de una joya real) de Pexels, libre de
// regalías para uso comercial.
const VIDEO_ARTESANIA =
  "https://videos.pexels.com/video-files/6263491/6263491-hd_1920_1080_25fps.mp4";
const POSTER_ARTESANIA =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80";

export function CraftsmanshipVideo() {
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducirMovimiento(consulta.matches);
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-stone-900 shadow-xl shadow-amber-800/10 lg:aspect-[4/5]">
        {reducirMovimiento ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_ARTESANIA}
            alt="Detalle de un anillo con cristal"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={POSTER_ARTESANIA}
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            <source src={VIDEO_ARTESANIA} type="video/mp4" />
          </video>
        )}
      </div>

      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-600/40 bg-white px-3 py-1 text-xs font-medium tracking-wide text-amber-800">
          <Gem size={13} aria-hidden="true" className="text-yellow-600" />
          Cada pieza, revisada a mano
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
          El detalle hace la diferencia
        </h2>
        <p className="mt-4 leading-relaxed text-stone-600">
          Antes de llegar a ti, revisamos cada arete, collar, pulsera y
          anillo pieza por pieza: acabados, cierres y brillo. No
          publicamos nada que nosotras mismas no usaríamos.
        </p>
      </div>
    </div>
  );
}
