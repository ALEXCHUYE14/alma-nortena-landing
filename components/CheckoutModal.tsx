"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Loader2,
  QrCode,
  Tag,
  X,
} from "lucide-react";
import type { ItemCarrito } from "@/lib/types";
import { formatearPrecio, urlWhatsAppPedido } from "@/lib/config";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";
import { createClient } from "@/lib/supabase/client";

type MetodoPago = "yape" | "coordinar";

interface CuponAplicado {
  codigo: string;
  tipo: "porcentaje" | "monto_fijo";
  valor: number;
}

interface CheckoutModalProps {
  items: ItemCarrito[];
  total: number;
  onCerrar: () => void;
  onPedidoEnviado: () => void;
}

export function CheckoutModal({
  items,
  total,
  onCerrar,
  onPedidoEnviado,
}: CheckoutModalProps) {
  const [metodo, setMetodo] = useState<MetodoPago>("yape");
  const [qrError, setQrError] = useState(false);

  const [codigoCupon, setCodigoCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState<CuponAplicado | null>(null);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState("");

  const descuento = cuponAplicado
    ? cuponAplicado.tipo === "porcentaje"
      ? total * (cuponAplicado.valor / 100)
      : Math.min(cuponAplicado.valor, total)
    : 0;
  const totalFinal = Math.max(0, total - descuento);

  const aplicarCupon = async () => {
    const codigo = codigoCupon.trim().toUpperCase();
    setErrorCupon("");

    if (!codigo) {
      setErrorCupon("Escribe un código de cupón.");
      return;
    }

    setValidandoCupon(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cupones")
      .select("codigo, tipo, valor, fecha_expiracion")
      .eq("codigo", codigo)
      .eq("activo", true)
      .maybeSingle();
    setValidandoCupon(false);

    if (error || !data) {
      setErrorCupon("Ese cupón no existe o ya no está activo.");
      return;
    }

    if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
      setErrorCupon("Ese cupón ya venció.");
      return;
    }

    setCuponAplicado({
      codigo: data.codigo,
      tipo: data.tipo as "porcentaje" | "monto_fijo",
      valor: data.valor,
    });
    setCodigoCupon("");
  };

  const quitarCupon = () => {
    setCuponAplicado(null);
    setErrorCupon("");
  };

  const confirmarPedido = (metodoPago: "Yape" | "Coordinar pago") => {
    const url = urlWhatsAppPedido(
      items,
      total,
      metodoPago,
      cuponAplicado ? { codigo: cuponAplicado.codigo, descuento } : undefined
    );
    window.open(url, "_blank", "noopener,noreferrer");
    onPedidoEnviado();
  };

  return (
    <>
      <motion.button
        key="checkout-overlay"
        type="button"
        aria-label="Cerrar checkout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div
        key="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Finalizar compra"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="fixed inset-x-4 top-1/2 z-[60] mx-auto max-h-[88vh] max-w-md -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:inset-x-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Finalizar compra
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm">
          {cuponAplicado && (
            <>
              <div className="flex items-center justify-between text-stone-500">
                <span>Subtotal</span>
                <span>{formatearPrecio(total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-yellow-700">
                <span>Cupón {cuponAplicado.codigo}</span>
                <span>-{formatearPrecio(descuento)}</span>
              </div>
              <div className="mt-1.5 border-t border-stone-200 pt-1.5" />
            </>
          )}
          <div className="flex items-center justify-between font-semibold text-stone-900">
            <span>Total a pagar</span>
            <span className="font-[family-name:var(--font-display)] text-lg text-amber-800">
              {formatearPrecio(totalFinal)}
            </span>
          </div>
        </div>

        {/* Cupón de descuento */}
        {cuponAplicado ? (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-yellow-600/30 bg-yellow-600/5 px-3 py-2 text-sm text-stone-700">
            <span className="flex items-center gap-1.5">
              <Tag size={14} className="text-yellow-600" aria-hidden="true" />
              Cupón <strong>{cuponAplicado.codigo}</strong> aplicado
            </span>
            <button
              type="button"
              onClick={quitarCupon}
              className="text-xs font-medium text-stone-500 underline underline-offset-4 hover:text-stone-700"
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={codigoCupon}
                disabled={validandoCupon}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCodigoCupon(e.target.value.toUpperCase())
                }
                placeholder="¿Tienes un cupón?"
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={aplicarCupon}
                disabled={validandoCupon}
                className="shrink-0 rounded-xl border border-amber-800 px-4 text-xs font-bold uppercase tracking-wider text-amber-800 transition-colors hover:bg-amber-800/5 disabled:opacity-60"
              >
                {validandoCupon ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  "Aplicar"
                )}
              </button>
            </div>
            {errorCupon && (
              <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-700">
                <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                {errorCupon}
              </p>
            )}
          </div>
        )}

        {/* Selector de método de pago */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setMetodo("yape")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              metodo === "yape"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <QrCode size={16} aria-hidden="true" />
            Pagar con Yape
          </button>
          <button
            type="button"
            onClick={() => setMetodo("coordinar")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              metodo === "coordinar"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Banknote size={16} aria-hidden="true" />
            Plin / Transferencia
          </button>
        </div>

        {metodo === "yape" ? (
          <div className="mt-5 text-center">
            <div className="mx-auto flex w-72 items-center justify-center overflow-hidden rounded-2xl border border-amber-800/15 bg-white p-3">
              {qrError ? (
                <div className="flex h-56 flex-col items-center justify-center gap-2 px-4 text-stone-400">
                  <QrCode size={40} aria-hidden="true" />
                  <p className="text-xs leading-snug">
                    El código QR de Yape aún no fue configurado en el sitio.
                  </p>
                </div>
              ) : (
                <Image
                  src="/yape-qr.png"
                  alt="Código QR de Yape de GRC Bisutería"
                  width={506}
                  height={274}
                  unoptimized
                  onError={() => setQrError(true)}
                  className="h-auto w-full object-contain"
                />
              )}
            </div>
            <p className="mt-3 text-sm text-stone-500">
              Escanea el QR desde tu app Yape y paga exactamente{" "}
              <span className="font-semibold text-stone-900">
                {formatearPrecio(totalFinal)}
              </span>
              .
            </p>
            <button
              type="button"
              onClick={() => confirmarPedido("Yape")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Ya pagué, enviar comprobante
            </button>
            <p className="mt-2 text-xs text-stone-400">
              Se abrirá WhatsApp con tu pedido para que envíes la captura del
              pago.
            </p>
          </div>
        ) : (
          <div className="mt-5 text-center">
            <div className="mx-auto flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-amber-800/25 bg-stone-50 px-6 text-stone-500">
              <Banknote size={36} className="text-amber-800/60" aria-hidden="true" />
              <p className="text-sm leading-snug">
                Tu asesora te compartirá el número Plin o la cuenta bancaria
                para transferir por WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => confirmarPedido("Coordinar pago")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
            >
              <IconoWhatsApp size={18} />
              Coordinar pago por WhatsApp
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
