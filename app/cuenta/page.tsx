import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AccountPage } from "@/components/AccountPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: `Ingresa o crea tu cuenta en ${siteConfig.nombre} para una experiencia más personalizada.`,
  robots: { index: false, follow: true },
};

export default function PaginaCuenta() {
  return (
    <>
      <Navbar />
      <main className="pt-32 lg:pt-44">
        <AccountPage />
      </main>
      <Footer />
    </>
  );
}
