import type { Metadata } from "next";
import { Filigrana } from "@/components/Filigrana";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SeccionPolitica } from "@/components/SeccionPolitica";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";
import { siteConfig, urlWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones",
  description: `Condiciones y proceso para solicitar un cambio de producto en ${siteConfig.nombre}.`,
};

export default function PaginaCambiosYDevoluciones() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:pt-44">
        <div className="mb-10 text-center">
          <Filigrana className="mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
            Política de Cambios y Devoluciones
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
            Queremos que quedes feliz con tu pieza. Así funcionan los
            cambios en {siteConfig.nombre}.
          </p>
        </div>

        <SeccionPolitica numero={1} titulo="Condiciones para el cambio">
          <p>
            Aceptamos el cambio de un producto dentro de los primeros 7 días
            calendario posteriores a la recepción de tu pedido, siempre que
            la pieza conserve sus etiquetas, no haya sido usada y se
            presente en su empaque original junto con el comprobante de
            compra (boleta, factura o el mensaje de confirmación de
            WhatsApp).
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={2} titulo="Productos no aptos para cambio">
          <p>
            Por tratarse de accesorios de uso personal, los aretes no
            aceptan cambio una vez retirados de su empaque, salvo que
            presenten un defecto de fabricación. Tampoco se aceptan cambios
            en productos en promoción marcados expresamente como
            &quot;liquidación&quot; o &quot;sin cambio&quot;.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={3} titulo="Proceso para solicitar un cambio">
          <p>
            Escríbenos por WhatsApp contándonos el motivo del cambio y
            adjuntando una foto del producto. Coordinaremos contigo la forma
            de devolución de la pieza y el envío del nuevo producto elegido.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={4} titulo="Devoluciones de dinero">
          <p>
            Al ser una tienda que opera por WhatsApp y medios digitales como
            Yape o Plin, priorizamos el cambio por otra pieza de igual o
            mayor valor (abonando la diferencia) antes que la devolución en
            efectivo. Si el producto presenta un defecto de fabricación
            comprobado y no contamos con un reemplazo, coordinamos contigo
            la devolución del monto pagado por el mismo medio de pago
            utilizado.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={5} titulo="Contacto para soporte">
          <p>
            Para cualquier consulta sobre cambios o devoluciones, escríbenos
            a {siteConfig.contacto.email} o por WhatsApp. Atendemos desde{" "}
            {siteConfig.contacto.direccion}, en el horario{" "}
            {siteConfig.contacto.horario}.
          </p>
          <a
            href={urlWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-50 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
          >
            <IconoWhatsApp size={16} />
            Escribir por WhatsApp
          </a>
        </SeccionPolitica>
      </main>
      <Footer />
    </>
  );
}
