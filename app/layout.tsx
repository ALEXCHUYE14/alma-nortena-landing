import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.nombre} | ${siteConfig.eslogan}`,
    template: `%s | ${siteConfig.nombre}`,
  },
  description: siteConfig.descripcion,
  keywords: [
    "moda femenina Piura",
    "joyería Catacaos",
    "filigrana de plata",
    "paja toquilla",
    "boutique Piura",
    "vestidos Piura",
    "accesorios artesanales Perú",
    "envío gratis Piura",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteConfig.url,
    siteName: siteConfig.nombre,
    title: `${siteConfig.nombre} | ${siteConfig.eslogan}`,
    description: siteConfig.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.nombre} | ${siteConfig.eslogan}`,
    description: siteConfig.descripcion,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  other: {
    "geo.region": "PE-PIU",
    "geo.placename": "Piura, Catacaos",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#92400e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-stone-50 text-stone-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
