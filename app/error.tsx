"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Filigrana } from "@/components/Filigrana";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error inesperado en Alma Norteña:", error);
  }, [error]);

  return (
    <div className="textura-toquilla flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Filigrana className="mb-6" />
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
        Algo no salió como esperábamos
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        Tuvimos un problema al cargar esta sección. Inténtalo de nuevo o
        escríbenos por WhatsApp si el problema continúa.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-amber-800 px-7 py-3.5 font-medium text-stone-50 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
      >
        <RefreshCcw size={18} aria-hidden="true" />
        Intentar de nuevo
      </button>
    </div>
  );
}
