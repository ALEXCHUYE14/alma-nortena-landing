import type { Metadata } from "next";
import { Filigrana } from "@/components/Filigrana";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SeccionPolitica } from "@/components/SeccionPolitica";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Términos y condiciones de uso de ${siteConfig.nombre}: productos, precios, medios de pago y envíos.`,
};

export default function PaginaTerminosYCondiciones() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:pt-44">
        <div className="mb-10 text-center">
          <Filigrana className="mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
            Términos y Condiciones de Uso
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
            Al navegar y realizar pedidos en {siteConfig.nombre} ({siteConfig.url}
            ) aceptas las condiciones descritas a continuación.
          </p>
        </div>

        <SeccionPolitica numero={1} titulo="Aspectos generales">
          <p>
            Este sitio web es operado por {siteConfig.nombre}, marca dedicada a
            la venta de bisutería y accesorios (aretes, collares, pulseras,
            anillos y sets combinados) con atención personalizada por
            WhatsApp. El uso de {siteConfig.url} implica la aceptación plena
            de estos Términos y Condiciones; si no estás de acuerdo con
            alguno de sus puntos, te pedimos no utilizar el sitio ni realizar
            pedidos a través de él.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={2} titulo="Productos y disponibilidad">
          <p>
            Las fotografías, descripciones y colores de cada producto son
            referenciales; por tratarse de piezas de bisutería puede existir
            una ligera variación de tono o brillo respecto a la imagen
            mostrada en pantalla. Todos los productos están sujetos a
            disponibilidad de stock: si al confirmar tu pedido una pieza ya
            no está disponible, te lo haremos saber por WhatsApp para
            ofrecerte una alternativa equivalente o la devolución del monto
            abonado.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={3} titulo="Precios y medios de pago">
          <p>
            Todos los precios publicados en {siteConfig.url} están expresados
            en Soles (S/) e incluyen los impuestos de ley. Los precios pueden
            actualizarse sin previo aviso, pero el monto válido para tu
            compra es siempre el que se confirme al momento de coordinar el
            pedido con tu asesora.
          </p>
          <p>
            Aceptamos pagos mediante Yape, Plin y transferencia bancaria
            (BCP / Interbank). El pedido se confirma una vez validado el
            pago; emitimos boleta o factura electrónica según lo que
            necesites.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={4} titulo="Envíos y entrega">
          <p>
            Dentro de Piura ciudad el envío se realiza el mismo día para
            pedidos confirmados dentro del horario de atención (
            {siteConfig.contacto.horario}). Para otras ciudades del Perú,
            el envío se coordina mediante courier y el tiempo de entrega
            dependerá del destino, información que tu asesora te confirmará
            antes de cerrar el pedido.
          </p>
          <p>
            {siteConfig.nombre} no se hace responsable por retrasos
            atribuibles a la empresa de courier una vez el paquete ha sido
            entregado a esta, aunque siempre acompañamos el seguimiento junto
            contigo hasta que tu pedido llegue.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={5} titulo="Modificaciones">
          <p>
            {siteConfig.nombre} puede actualizar estos Términos y Condiciones
            en cualquier momento para reflejar cambios en nuestros procesos
            o en la normativa vigente; la versión publicada en esta página es
            siempre la vigente. Te recomendamos revisarla periódicamente.
          </p>
        </SeccionPolitica>

        <SeccionPolitica numero={6} titulo="Ley aplicable">
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la
            República del Perú, incluyendo el Código de Protección y
            Defensa del Consumidor. Cualquier controversia se resolverá ante
            los organismos y autoridades competentes en dicha jurisdicción.
          </p>
        </SeccionPolitica>
      </main>
      <Footer />
    </>
  );
}
