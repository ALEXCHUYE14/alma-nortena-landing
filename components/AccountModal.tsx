"use client";

import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Loader2,
  Lock,
  LogOut,
  Mail,
  User as UserIcon,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/config";
import { useAuth } from "@/components/AuthProvider";

type Modo = "ingresar" | "registrarse";

function iniciales(texto: string): string {
  return texto.trim().slice(0, 1).toUpperCase() || "?";
}

export function AccountModal({ onCerrar }: { onCerrar: () => void }) {
  const { usuario, cargando: cargandoSesion, cerrarSesion } = useAuth();

  return (
    <>
      <motion.button
        key="account-overlay"
        type="button"
        aria-label="Cerrar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 z-[70] bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div
        key="account-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mi cuenta"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-h-[88vh] w-auto max-w-sm -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:inset-x-auto sm:w-full"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {cargandoSesion ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-amber-800" aria-hidden="true" />
          </div>
        ) : usuario ? (
          <PanelSesionActiva
            email={usuario.email ?? ""}
            nombre={(usuario.user_metadata?.nombre as string) || ""}
            onCerrarSesion={async () => {
              await cerrarSesion();
              onCerrar();
            }}
          />
        ) : (
          <FormularioAuth onExito={onCerrar} />
        )}
      </motion.div>
    </>
  );
}

function PanelSesionActiva({
  email,
  nombre,
  onCerrarSesion,
}: {
  email: string;
  nombre: string;
  onCerrarSesion: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-800 text-lg font-bold text-stone-50">
        {iniciales(nombre || email)}
      </div>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-stone-900">
        {nombre ? `Hola, ${nombre}` : "Tu cuenta"}
      </h2>
      <p className="mt-1 text-sm text-stone-500">{email}</p>

      <button
        type="button"
        onClick={onCerrarSesion}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors hover:bg-stone-50"
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>
  );
}

function FormularioAuth({ onExito }: { onExito: () => void }) {
  const [modo, setModo] = useState<Modo>("ingresar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cambiarModo = (nuevo: Modo) => {
    setModo(nuevo);
    setError("");
    setMensajeExito(null);
  };

  const manejarEnviar = async () => {
    setError("");
    setMensajeExito(null);

    const correo = email.trim();
    if (!correo || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (modo === "registrarse" && !nombre.trim()) {
      setError("Cuéntanos tu nombre para crear la cuenta.");
      return;
    }

    setCargando(true);
    const supabase = createClient();

    if (modo === "registrarse") {
      const { data, error: errorRegistro } = await supabase.auth.signUp({
        email: correo,
        password,
        options: {
          data: { nombre: nombre.trim() },
          emailRedirectTo: siteConfig.url,
        },
      });

      setCargando(false);

      if (errorRegistro) {
        setError(
          /already registered|already exists/i.test(errorRegistro.message)
            ? "Ya existe una cuenta con este correo. Intenta iniciar sesión."
            : "No pudimos crear tu cuenta. Inténtalo de nuevo."
        );
        return;
      }

      if (data.session) {
        onExito();
        return;
      }

      setMensajeExito(
        "¡Listo! Revisa tu correo y confirma tu cuenta para poder ingresar."
      );
      return;
    }

    const { error: errorIngreso } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    setCargando(false);

    if (errorIngreso) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    onExito();
  };

  return (
    <div>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-800/10 text-amber-800">
        <UserIcon size={26} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-center font-[family-name:var(--font-display)] text-lg font-bold text-stone-900">
        {modo === "ingresar" ? "Ingresa a tu cuenta" : "Crea tu cuenta"}
      </h2>

      {/* Selector de modo */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => cambiarModo("ingresar")}
          className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            modo === "ingresar"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => cambiarModo("registrarse")}
          className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            modo === "registrarse"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {modo === "registrarse" && (
          <div className="relative">
            <UserIcon
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60"
            />
            <input
              type="text"
              value={nombre}
              disabled={cargando}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white disabled:opacity-60"
            />
          </div>
        )}

        <div className="relative">
          <Mail
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60"
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            disabled={cargando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white disabled:opacity-60"
          />
        </div>

        <div className="relative">
          <Lock
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60"
          />
          <input
            type="password"
            autoComplete={modo === "ingresar" ? "current-password" : "new-password"}
            value={password}
            disabled={cargando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white disabled:opacity-60"
          />
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {mensajeExito && (
          <p role="status" className="text-sm text-green-700">
            {mensajeExito}
          </p>
        )}

        <button
          type="button"
          onClick={manejarEnviar}
          disabled={cargando}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:opacity-70"
        >
          {cargando ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : modo === "ingresar" ? (
            "Ingresar"
          ) : (
            "Crear cuenta"
          )}
        </button>
      </div>
    </div>
  );
}
