"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/config";
import { useAuth } from "@/components/AuthProvider";

type Modo = "ingresar" | "registrarse" | "recuperar";

function iniciales(texto: string): string {
  return texto.trim().slice(0, 1).toUpperCase() || "?";
}

const CLASE_INPUT =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none disabled:opacity-60";

/**
 * Página completa de cuenta (/cuenta): pantalla a página completa (con
 * Navbar y Footer del sitio) inspirada en la referencia visual que pidió
 * el negocio — sin tarjeta ni íconos dentro de los campos, con el botón
 * principal y "¿Olvidó su contraseña?" en la misma fila. La lógica de
 * autenticación con Supabase es la misma que ya existía.
 */
export function AccountPage() {
  const { usuario, cargando: cargandoSesion, cerrarSesion } = useAuth();

  return (
    <div className="mx-auto max-w-xl px-4 pb-20 sm:px-6">
      {cargandoSesion ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-amber-800" aria-hidden="true" />
        </div>
      ) : usuario ? (
        <PanelSesionActiva
          email={usuario.email ?? ""}
          nombre={(usuario.user_metadata?.nombre as string) || ""}
          onCerrarSesion={cerrarSesion}
        />
      ) : (
        <FormularioAuth />
      )}
    </div>
  );
}

function PanelSesionActiva({
  email,
  nombre,
  onCerrarSesion,
}: {
  email: string;
  nombre: string;
  onCerrarSesion: () => Promise<void>;
}) {
  const [cerrando, setCerrando] = useState(false);

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-800 text-xl font-bold text-stone-50">
        {iniciales(nombre || email)}
      </div>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900">
        {nombre ? `Hola, ${nombre}` : "Tu cuenta"}
      </h1>
      <p className="mt-1 text-sm text-stone-500">{email}</p>

      <button
        type="button"
        disabled={cerrando}
        onClick={async () => {
          setCerrando(true);
          await onCerrarSesion();
          setCerrando(false);
        }}
        className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-full border border-stone-300 px-8 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60"
      >
        {cerrando ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <LogOut size={16} aria-hidden="true" />
        )}
        Cerrar sesión
      </button>

      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

function FormularioAuth() {
  const router = useRouter();
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
    setPassword("");
  };

  const manejarRecuperar = async () => {
    setError("");
    setMensajeExito(null);

    const correo = email.trim();
    if (!correo) {
      setError("Escribe tu correo para enviarte las instrucciones.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { error: errorRecuperar } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${siteConfig.url}/cuenta`,
    });
    setCargando(false);

    if (errorRecuperar) {
      setError("No pudimos enviar el correo de recuperación. Inténtalo de nuevo.");
      return;
    }

    setMensajeExito(
      "Si el correo está registrado, te enviamos instrucciones para restablecer tu contraseña."
    );
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
        router.push("/");
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

    router.push("/");
  };

  if (modo === "recuperar") {
    return (
      <div>
        <h1 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
          Recuperar contraseña
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-stone-500">
          Escribe tu correo y te enviaremos instrucciones para restablecer tu
          contraseña.
        </p>

        <div className="mx-auto mt-8 max-w-md space-y-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            disabled={cargando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className={CLASE_INPUT}
          />

          {error && (
            <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          {mensajeExito && (
            <p role="status" className="flex items-start gap-2 text-sm text-green-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {mensajeExito}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <button
              type="button"
              onClick={manejarRecuperar}
              disabled={cargando}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-800 px-10 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:opacity-70"
            >
              {cargando ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                "Enviar instrucciones"
              )}
            </button>

            <button
              type="button"
              onClick={() => cambiarModo("ingresar")}
              className="text-xs font-medium text-amber-800 underline underline-offset-4"
            >
              Volver a iniciar sesión
            </button>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="text-sm font-medium text-amber-800 underline underline-offset-4"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
        {modo === "ingresar" ? "Iniciar sesión" : "Crea tu cuenta"}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-stone-500">
        {modo === "ingresar" ? (
          <>
            ¿Todavía no tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => cambiarModo("registrarse")}
              className="font-medium text-amber-800 underline underline-offset-4"
            >
              Regístrate aquí
            </button>
            .
          </>
        ) : (
          <>
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => cambiarModo("ingresar")}
              className="font-medium text-amber-800 underline underline-offset-4"
            >
              Inicia sesión aquí
            </button>
            .
          </>
        )}
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-4">
        {modo === "registrarse" && (
          <input
            type="text"
            value={nombre}
            disabled={cargando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className={CLASE_INPUT}
          />
        )}

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          disabled={cargando}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className={CLASE_INPUT}
        />

        <input
          type="password"
          autoComplete={modo === "ingresar" ? "current-password" : "new-password"}
          value={password}
          disabled={cargando}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className={CLASE_INPUT}
        />

        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {mensajeExito && (
          <p role="status" className="flex items-start gap-2 text-sm text-green-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {mensajeExito}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
          <button
            type="button"
            onClick={manejarEnviar}
            disabled={cargando}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-800 px-10 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:opacity-70"
          >
            {cargando ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : modo === "ingresar" ? (
              "Iniciar sesión"
            ) : (
              "Crear cuenta"
            )}
          </button>

          {modo === "ingresar" && (
            <button
              type="button"
              onClick={() => cambiarModo("recuperar")}
              className="text-xs font-medium text-amber-800 underline underline-offset-4"
            >
              ¿Olvidó su contraseña?
            </button>
          )}
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            Volver a la tienda
          </Link>
        </div>

        <p className="pt-4 text-xs leading-relaxed text-stone-400">
          Tu información está protegida y solo la usamos para gestionar tu
          cuenta y tus pedidos en {siteConfig.nombre}.
        </p>
      </div>
    </div>
  );
}
