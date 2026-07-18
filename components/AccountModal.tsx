"use client";

import { motion } from "framer-motion";
import { MessageCircle, UserRound, X } from "lucide-react";
import { urlWhatsApp } from "@/lib/config";

export function AccountModal({ onCerrar }: { onCerrar: () => void }) {
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
        className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-2xl sm:inset-x-auto"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-800/10 text-amber-800">
          <UserRound size={26} aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-stone-900">
          Cuentas próximamente
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Por ahora no necesitas crear una cuenta: tus pedidos se coordinan
          directo por WhatsApp con tu asesora, sin formularios.
        </p>
        <a
          href={urlWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCerrar}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Escríbenos por WhatsApp
        </a>
      </motion.div>
    </>
  );
}
