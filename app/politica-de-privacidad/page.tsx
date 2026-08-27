import type { Metadata } from "next";
import { Filigrana } from "@/components/Filigrana";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SeccionPolitica } from "@/components/SeccionPolitica";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Cómo ${siteConfig.nombre} recopila, usa y protege tus datos personales.`,
};

export default function PaginaPoliticaDePrivacidad() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:pt-44">
        <div className="mb-10 text-center">
          <Filigrana className="mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
            Política de Privacidad
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
            Tu confianza nos importa: así cuidamos la información que nos
            compartes en {siteConfig.url}.
          </p>
        </div>

        <SeccionPolitica numero={1} titulo="Recopilación de datos">
          <p>
            Recopilamos únicamente los datos necesarios para atender tu
            pedido o consulta: nombre, número de WhatsApp, dirección de
            envío y, si decides suscribirte al Club GRC, tu correo
            electrónico. No solicitamos datos de tarjetas ni información
            financiera a través del sitio: los pagos se coordinan
            directamente por Yape, Plin o transferencia con tu asesora.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={2} titulo="Uso y protección de tus datos">
          <p>
            Usamos tus datos exclusivamente para procesar y despachar tu
            pedido, responder tus consultas y, si lo autorizaste, enviarte
            novedades de la colección. No vendemos ni compartimos tu
            información con terceros ajenos a la operación de la tienda
            (por ejemplo, la empresa de courier recibe solo los datos
            necesarios para hacerte llegar tu pedido).
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={3} titulo="Comunicaciones y promociones">
          <p>
            Solo te escribimos con fines promocionales (preventas,
            descuentos y novedades) si te suscribiste voluntariamente al
            Club GRC. Puedes darte de baja en cualquier momento
            escribiéndonos por WhatsApp o al correo {siteConfig.contacto.email}
            , sin que esto afecte pedidos ya realizados.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={4} titulo="Tus derechos">
          <p>
            De acuerdo con la Ley N.º 29733, Ley de Protección de Datos
            Personales del Perú, puedes solicitar en cualquier momento el
            acceso, rectificación, cancelación u oposición (derechos ARCO)
            sobre tus datos personales, escribiendo a{" "}
            {siteConfig.contacto.email} o por WhatsApp. Atenderemos tu
            solicitud a la brevedad.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={5} titulo="Cookies y tecnologías similares">
          <p>
            Este sitio utiliza almacenamiento local del navegador (no
            cookies de rastreo publicitario) únicamente para recordar tu
            carrito, favoritos y preferencias mientras navegas; esta
            información se guarda en tu propio dispositivo y no se comparte
            con terceros.
          </p>
        </SeccionPolitica>
      </main>
      <Footer />
    </>
  );
}
