"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/config";
import { TIPOS_DOCUMENTO, type TipoDocumento } from "@/lib/types";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Tipo = "Reclamo" | "Queja";

const CLASE_INPUT =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none disabled:opacity-60";
const CLASE_LABEL = "mb-1.5 block text-sm font-medium text-stone-900";

export function LibroReclamaciones() {
  const [tipo, setTipo] = useState<Tipo>("Reclamo");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [productoServicio, setProductoServicio] = useState("");
  const [montoReclamado, setMontoReclamado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pedido, setPedido] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [numeroReclamo, setNumeroReclamo] = useState<string | null>(null);

  const manejarEnviar = async () => {
    setError("");

    if (!nombreCompleto.trim() || !numeroDocumento.trim() || !telefono.trim()) {
      setError("Completa tus datos de contacto: nombre, documento y teléfono.");
      return;
    }
    if (!REGEX_EMAIL.test(email.trim())) {
      setError("Escribe un correo válido para enviarte la respuesta.");
      return;
    }
    if (!productoServicio.trim()) {
      setError("Cuéntanos qué producto o servicio está relacionado con tu reclamo.");
      return;
    }
    if (!descripcion.trim()) {
      setError("Describe brevemente el detalle de tu reclamo o queja.");
      return;
    }
    if (!pedido.trim()) {
      setError("Indica qué solicitas como solución (tu pedido).");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const monto = montoReclamado.trim() ? Number(montoReclamado) : null;
    const { data, error: errorInsercion } = await supabase
      .from("reclamos")
      .insert({
        tipo,
        nombre_completo: nombreCompleto.trim(),
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        producto_servicio: productoServicio.trim(),
        monto_reclamado: monto !== null && !Number.isNaN(monto) ? monto : null,
        descripcion: descripcion.trim(),
        pedido: pedido.trim(),
      })
      .select("id")
      .single();

    setCargando(false);

    if (errorInsercion || !data) {
      setError(
        "No pudimos registrar tu reclamo en este momento. Inténtalo de nuevo o escríbenos por WhatsApp."
      );
      return;
    }

    setNumeroReclamo(data.id.slice(0, 8).toUpperCase());
  };

  if (numeroReclamo) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-yellow-600/30 bg-yellow-600/5 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-yellow-600" aria-hidden="true" />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
          Tu {tipo.toLowerCase()} fue registrado
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          N° de registro: <span className="font-mono font-semibold">{numeroReclamo}</span>
          <br />
          Te responderemos al correo que registraste en un plazo no mayor a
          30 días calendario, conforme al Código de Protección y Defensa
          del Consumidor.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm leading-relaxed text-stone-500">
        Conforme a lo establecido en el Código de Protección y Defensa del
        Consumidor, {siteConfig.nombre} pone a tu disposición este Libro de
        Reclamaciones Virtual. La presentación de un reclamo no impide
        acudir a otras vías de solución de controversias ni es requisito
        previo para interponer una denuncia ante el INDECOPI.
      </p>

      <div className="mt-8 space-y-8">
        {/* 1. Tipo */}
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest text-yellow-600">
            1. Tipo
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setTipo("Reclamo")}
              className={`rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                tipo === "Reclamo"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Reclamo
            </button>
            <button
              type="button"
              onClick={() => setTipo("Queja")}
              className={`rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                tipo === "Queja"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Queja
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-400">
            {tipo === "Reclamo"
              ? "Disconformidad relacionada con el producto entregado."
              : "Disconformidad con la atención recibida, no relacionada con el producto."}
          </p>
        </fieldset>

        {/* 2. Datos del consumidor */}
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest text-yellow-600">
            2. Datos del consumidor
          </legend>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="rl-nombre" className={CLASE_LABEL}>
                Nombre completo
              </label>
              <input
                id="rl-nombre"
                type="text"
                value={nombreCompleto}
                disabled={cargando}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNombreCompleto(e.target.value)}
                className={CLASE_INPUT}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rl-tipo-doc" className={CLASE_LABEL}>
                  Tipo de documento
                </label>
                <select
                  id="rl-tipo-doc"
                  value={tipoDocumento}
                  disabled={cargando}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setTipoDocumento(e.target.value as TipoDocumento)
                  }
                  className={CLASE_INPUT}
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rl-num-doc" className={CLASE_LABEL}>
                  N° de documento
                </label>
                <input
                  id="rl-num-doc"
                  type="text"
                  value={numeroDocumento}
                  disabled={cargando}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNumeroDocumento(e.target.value)}
                  className={CLASE_INPUT}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rl-telefono" className={CLASE_LABEL}>
                  Teléfono
                </label>
                <input
                  id="rl-telefono"
                  type="tel"
                  value={telefono}
                  disabled={cargando}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)}
                  className={CLASE_INPUT}
                />
              </div>
              <div>
                <label htmlFor="rl-email" className={CLASE_LABEL}>
                  Correo electrónico
                </label>
                <input
                  id="rl-email"
                  type="email"
                  inputMode="email"
                  value={email}
                  disabled={cargando}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className={CLASE_INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="rl-direccion" className={CLASE_LABEL}>
                Domicilio (opcional)
              </label>
              <input
                id="rl-direccion"
                type="text"
                value={direccion}
                disabled={cargando}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDireccion(e.target.value)}
                className={CLASE_INPUT}
              />
            </div>
          </div>
        </fieldset>

        {/* 3. Datos del bien contratado */}
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest text-yellow-600">
            3. Datos del bien contratado
          </legend>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="rl-producto" className={CLASE_LABEL}>
                Producto o servicio
              </label>
              <input
                id="rl-producto"
                type="text"
                placeholder="Ej. Aretes Statement Piedra Azul"
                value={productoServicio}
                disabled={cargando}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProductoServicio(e.target.value)}
                className={CLASE_INPUT}
              />
            </div>
            <div>
              <label htmlFor="rl-monto" className={CLASE_LABEL}>
                Monto reclamado en S/ (opcional)
              </label>
              <input
                id="rl-monto"
                type="number"
                min="0"
                step="0.01"
                value={montoReclamado}
                disabled={cargando}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMontoReclamado(e.target.value)}
                className={CLASE_INPUT}
              />
            </div>
          </div>
        </fieldset>

        {/* 4. Detalle */}
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest text-yellow-600">
            4. Detalle
          </legend>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="rl-descripcion" className={CLASE_LABEL}>
                Detalle del {tipo.toLowerCase()}
              </label>
              <textarea
                id="rl-descripcion"
                rows={4}
                value={descripcion}
                disabled={cargando}
                onChange={(e) => setDescripcion(e.target.value)}
                className={`${CLASE_INPUT} resize-none`}
              />
            </div>
            <div>
              <label htmlFor="rl-pedido" className={CLASE_LABEL}>
                Pedido del consumidor
              </label>
              <textarea
                id="rl-pedido"
                rows={3}
                placeholder="¿Qué solución esperas?"
                value={pedido}
                disabled={cargando}
                onChange={(e) => setPedido(e.target.value)}
                className={`${CLASE_INPUT} resize-none`}
              />
            </div>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={manejarEnviar}
          disabled={cargando}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:opacity-70 sm:w-auto sm:px-10"
        >
          {cargando ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            `Enviar ${tipo.toLowerCase()}`
          )}
        </button>
      </div>
    </div>
  );
}
