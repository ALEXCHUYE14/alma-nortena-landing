"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  MessageCircle,
  QrCode,
  X,
} from "lucide-react";
import type { ItemCarrito } from "@/lib/types";
import { formatearPrecio, urlWhatsAppPedido } from "@/lib/config";

type MetodoPago = "yape" | "coordinar";

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

  const confirmarPedido = (metodoPago: "Yape" | "Coordinar pago") => {
    const url = urlWhatsAppPedido(items, total, metodoPago);
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
          <div className="flex items-center justify-between font-semibold text-stone-900">
            <span>Total a pagar</span>
            <span className="font-[family-name:var(--font-display)] text-lg text-amber-800">
              {formatearPrecio(total)}
            </span>
          </div>
        </div>

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
            <div className="mx-auto flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl border border-amber-800/15 bg-stone-50">
              {qrError ? (
                <div className="flex flex-col items-center gap-2 px-4 text-stone-400">
                  <QrCode size={40} aria-hidden="true" />
                  <p className="text-xs leading-snug">
                    El código QR de Yape aún no fue configurado en el sitio.
                  </p>
                </div>
              ) : (
                <Image
                  src="/yape-qr.png"
                  alt="Código QR de Yape de Alma Norteña"
                  width={224}
                  height={224}
                  unoptimized
                  onError={() => setQrError(true)}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <p className="mt-3 text-sm text-stone-500">
              Escanea el QR desde tu app Yape y paga exactamente{" "}
              <span className="font-semibold text-stone-900">
                {formatearPrecio(total)}
              </span>
              .
            </p>
            <button
              type="button"
              onClick={() => confirmarPedido("Yape")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 font-medium text-stone-50 transition-colors hover:bg-amber-900"
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 font-medium text-stone-50 transition-colors hover:bg-amber-900"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Coordinar pago por WhatsApp
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
