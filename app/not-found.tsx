import Link from "next/link";
import { Filigrana } from "@/components/Filigrana";

export default function NotFound() {
  return (
    <div className="textura-toquilla flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Filigrana className="mb-6" />
      <p className="font-[family-name:var(--font-display)] text-7xl text-amber-800">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-stone-900">
        Esta página se perdió en el camino a Catacaos
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        No encontramos lo que buscabas, pero nuestra colección completa te
        espera en la página principal.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-800 px-7 py-3.5 font-medium text-stone-50 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
