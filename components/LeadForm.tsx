"use client";

import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DISTRITOS, type Distrito, type EstadoFormulario } from "@/lib/types";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LeadForm() {
  const [email, setEmail] = useState("");
  const [distrito, setDistrito] = useState<Distrito>("Piura");
  const [estado, setEstado] = useState<EstadoFormulario>("idle");
  const [mensajeError, setMensajeError] = useState("");

  const manejarEnvio = async () => {
    const emailLimpio = email.trim().toLowerCase();

    if (!REGEX_EMAIL.test(emailLimpio)) {
      setEstado("error");
      setMensajeError("Escribe un correo válido, por ejemplo: maria@gmail.com");
      return;
    }

    setEstado("submitting");
    setMensajeError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("leads_suscritos")
      .insert({ email: emailLimpio, distrito });

    if (error) {
      setEstado("error");
      // 23505 = violación de unicidad en PostgreSQL (correo ya registrado)
      setMensajeError(
        error.code === "23505"
          ? "Este correo ya forma parte del Club GRC. ¡Gracias por acompañarnos!"
          : "No pudimos registrar tu correo. Revisa tu conexión e inténtalo de nuevo."
      );
      return;
    }

    setEstado("success");
    setEmail("");
  };

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">
        {estado === "success" ? (
          <motion.div
            key="exito"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-yellow-600/40 bg-white p-8 text-center shadow-sm"
            role="status"
          >
            <CheckCircle2
              size={44}
              className="mx-auto text-yellow-600"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-stone-900">
              ¡Bienvenida al Club GRC!
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Recibirás nuestras novedades, preventas y descuentos exclusivos
              para {distrito} antes que nadie.
            </p>
            <button
              type="button"
              onClick={() => setEstado("idle")}
              className="mt-5 text-sm font-medium text-amber-800 underline underline-offset-4"
            >
              Registrar otro correo
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="formulario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-amber-800/15 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="lead-email"
                  className="mb-1.5 block text-sm font-medium text-stone-900"
                >
                  Tu correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60"
                  />
                  <input
                    id="lead-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="maria@gmail.com"
                    value={email}
                    disabled={estado === "submitting"}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      if (estado === "error") setEstado("idle");
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-distrito"
                  className="mb-1.5 block text-sm font-medium text-stone-900"
                >
                  ¿Desde qué distrito nos escribes?
                </label>
                <div className="relative">
                  <MapPin
                    size={17}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60"
                  />
                  <select
                    id="lead-distrito"
                    value={distrito}
                    disabled={estado === "submitting"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setDistrito(e.target.value as Distrito)
                    }
                    className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-9 text-stone-900 focus:border-amber-800 focus:bg-white disabled:opacity-60"
                  >
                    {DISTRITOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400"
                  >
                    ▾
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {estado === "error" && (
                  <motion.p
                    key="error"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 text-sm text-red-700"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {mensajeError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={manejarEnvio}
                disabled={estado === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-all duration-200 hover:bg-amber-900 active:scale-[0.98] disabled:opacity-70"
              >
                {estado === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Registrando…
                  </>
                ) : (
                  "Unirme al Club GRC"
                )}
              </button>

              <p className="text-center text-xs text-stone-400">
                Solo novedades y descuentos. Nada de spam, palabra de norteña.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
