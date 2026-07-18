/**
 * Divisor ornamental inspirado en la filigrana de plata de Catacaos.
 * Espirales simétricas trazadas a mano en SVG — la firma visual que
 * separa las secciones de la página.
 */
export function Filigrana({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-600/60 sm:w-24" />
      <svg
        width="120"
        height="28"
        viewBox="0 0 120 28"
        fill="none"
        className="text-yellow-600"
      >
        {/* Espiral izquierda */}
        <path
          d="M38 14c-6 0-9-3.5-9-7 0-2.8 2.2-4.5 4.5-4.5 1.9 0 3.2 1.3 3.2 3 0 1.4-1 2.4-2.3 2.4-1 0-1.7-.7-1.7-1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M38 14c-6 0-9 3.5-9 7 0 2.8 2.2 4.5 4.5 4.5 1.9 0 3.2-1.3 3.2-3 0-1.4-1-2.4-2.3-2.4-1 0-1.7.7-1.7 1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Rombo central (semilla de algarrobo) */}
        <path
          d="M60 6l6 8-6 8-6-8 6-8z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="14" r="1.8" fill="currentColor" />
        {/* Espiral derecha (espejo) */}
        <path
          d="M82 14c6 0 9-3.5 9-7 0-2.8-2.2-4.5-4.5-4.5-1.9 0-3.2 1.3-3.2 3 0 1.4 1 2.4 2.3 2.4 1 0 1.7-.7 1.7-1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M82 14c6 0 9 3.5 9 7 0 2.8-2.2 4.5-4.5 4.5-1.9 0-3.2-1.3-3.2-3 0-1.4 1-2.4 2.3-2.4 1 0 1.7.7 1.7 1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Puntos de granetería */}
        <circle cx="46" cy="14" r="1.2" fill="currentColor" />
        <circle cx="74" cy="14" r="1.2" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-600/60 sm:w-24" />
    </div>
  );
}
