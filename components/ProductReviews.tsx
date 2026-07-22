"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { promedioCalificacion } from "@/lib/config";
import type { Resena } from "@/lib/types";

function Estrellas({
  calificacion,
  size = 16,
}: {
  calificacion: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(calificacion) ? "text-yellow-600" : "text-stone-300"}
          fill={n <= Math.round(calificacion) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ProductReviews({ productoId }: { productoId: string }) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      setCargando(true);
      setErrorCarga(false);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("resenas")
        .select("*")
        .eq("producto_id", productoId)
        .eq("aprobado", true)
        .order("created_at", { ascending: false });

      if (cancelado) return;

      if (error) {
        setErrorCarga(true);
      } else {
        setResenas((data ?? []) as Resena[]);
      }
      setCargando(false);
    })();

    return () => {
      cancelado = true;
    };
  }, [productoId]);

  const promedio = promedioCalificacion(resenas);

  return (
    <section className="mt-14 border-t border-amber-800/10 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
            Reseñas de clientas
          </h2>
          {promedio !== null && (
            <div className="mt-1.5 flex items-center gap-2">
              <Estrellas calificacion={promedio} />
              <span className="text-sm text-stone-500">
                {promedio} de 5 · {resenas.length}{" "}
                {resenas.length === 1 ? "reseña" : "reseñas"}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFormularioAbierto((v) => !v)}
          className="rounded-full border border-amber-800 px-5 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 transition-colors hover:bg-amber-800/5"
        >
          {formularioAbierto ? "Cancelar" : "Escribir una reseña"}
        </button>
      </div>

      {formularioAbierto && (
        <FormularioResena
          productoId={productoId}
          onCerrar={() => setFormularioAbierto(false)}
        />
      )}

      <div className="mt-8">
        {cargando ? (
          <div className="flex justify-center py-8">
            <Loader2 size={22} className="animate-spin text-amber-800" aria-hidden="true" />
          </div>
        ) : errorCarga ? (
          <p className="text-sm text-stone-500">
            No pudimos cargar las reseñas. Intenta recargar la página.
          </p>
        ) : resenas.length === 0 ? (
          <p className="text-sm text-stone-500">
            Todavía no hay reseñas para esta pieza. ¡Sé la primera en
            compartir tu experiencia!
          </p>
        ) : (
          <ul className="space-y-6">
            {resenas.map((resena) => (
              <li key={resena.id} className="border-b border-stone-100 pb-6 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">{resena.nombre}</p>
                  <p className="text-xs text-stone-400">
                    {formatearFecha(resena.created_at)}
                  </p>
                </div>
                <div className="mt-1.5">
                  <Estrellas calificacion={resena.calificacion} size={14} />
                </div>
                {resena.comentario && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {resena.comentario}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FormularioResena({
  productoId,
  onCerrar,
}: {
  productoId: string;
  onCerrar: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [calificacionHover, setCalificacionHover] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const manejarEnviar = async () => {
    setError("");

    if (!nombre.trim()) {
      setError("Cuéntanos tu nombre para publicar la reseña.");
      return;
    }
    if (!comentario.trim()) {
      setError("Escribe brevemente tu experiencia con esta pieza.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { error: errorInsercion } = await supabase.from("resenas").insert({
      producto_id: productoId,
      nombre: nombre.trim(),
      calificacion,
      comentario: comentario.trim(),
      aprobado: false,
    });
    setCargando(false);

    if (errorInsercion) {
      setError("No pudimos enviar tu reseña. Inténtalo de nuevo.");
      return;
    }

    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="mt-6 flex items-start gap-2 rounded-xl border border-yellow-600/30 bg-yellow-600/5 p-4 text-sm text-stone-700">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
        <p>
          ¡Gracias por tu reseña! Se publicará en unas horas, luego de una
          breve revisión.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-amber-800/15 bg-stone-50 p-5">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCalificacion(n)}
            onMouseEnter={() => setCalificacionHover(n)}
            onMouseLeave={() => setCalificacionHover(null)}
            aria-label={`Calificar con ${n} de 5 estrellas`}
            className="text-yellow-600"
          >
            <Star
              size={24}
              fill={n <= (calificacionHover ?? calificacion) ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      <input
        type="text"
        value={nombre}
        disabled={cargando}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        className="mt-4 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:outline-none disabled:opacity-60"
      />

      <textarea
        value={comentario}
        disabled={cargando}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="¿Qué te pareció esta pieza?"
        rows={3}
        className="mt-3 w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:outline-none disabled:opacity-60"
      />

      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={manejarEnviar}
        disabled={cargando}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:opacity-70"
      >
        {cargando ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          "Enviar reseña"
        )}
      </button>
      <button
        type="button"
        onClick={onCerrar}
        className="ml-3 text-xs font-medium text-stone-500 hover:text-stone-700"
      >
        Cancelar
      </button>
    </div>
  );
}
