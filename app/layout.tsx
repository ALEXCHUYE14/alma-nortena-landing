import type { Metadata, Viewport } from "next";
import { DM_Sans, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/CartProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
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
    "bisutería Piura",
    "accesorios de moda Perú",
    "aretes de moda",
    "collares minimalistas",
    "pulseras de moda",
    "bisutería juvenil",
    "regalos para mujer Piura",
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
    "geo.placename": "Piura",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a9793b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: siteConfig.nombre,
  description: siteConfig.descripcion,
  url: siteConfig.url,
  telephone: `+${siteConfig.whatsapp.numero}`,
  email: siteConfig.contacto.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contacto.direccion,
    addressRegion: "Piura",
    addressCountry: "PE",
  },
  openingHours: "Mo-Sa 09:00-20:00",
  sameAs: [
    siteConfig.redes.instagram,
    siteConfig.redes.facebook,
    siteConfig.redes.tiktok,
  ],
  priceRange: "S/",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={`${dmSans.variable} ${script.variable}`}>
      <body className="bg-stone-50 text-stone-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <WhatsAppFlotante />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
