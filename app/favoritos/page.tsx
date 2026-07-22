import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FavoritesPage } from "@/components/FavoritesPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tus favoritos",
  description: `Las piezas que guardaste en ${siteConfig.nombre} para verlas más tarde.`,
  robots: { index: false, follow: true },
};

export default function PaginaFavoritos() {
  return (
    <>
      <Navbar />
      <main className="pt-32 lg:pt-44">
        <FavoritesPage />
      </main>
      <Footer />
    </>
  );
}
