"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { enlacesNavegacion, formatearPrecio, siteConfig, urlWhatsApp } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";
import { CheckoutModal } from "@/components/CheckoutModal";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [conScroll, setConScroll] = useState(false);
  const { items, totalUnidades, totalSoles, agregarProducto, quitarProducto, vaciarCarrito } =
    useCarrito();

  // Sombra sutil al hacer scroll
  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear el scroll del fondo cuando un panel está abierto
  useEffect(() => {
    const abierto = menuAbierto || carritoAbierto || checkoutAbierto;
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto, carritoAbierto, checkoutAbierto]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        setCarritoAbierto(false);
        setCheckoutAbierto(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-stone-50/90 backdrop-blur-md transition-shadow duration-300 ${
          conScroll ? "shadow-[0_1px_0_0_rgba(146,64,14,0.15),0_8px_24px_-16px_rgba(28,25,23,0.25)]" : ""
        }`}
      >
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-20"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-wide text-stone-900 lg:text-2xl"
          >
            Alma <span className="italic text-amber-800">Norteña</span>
          </Link>

          {/* Navegación desktop */}
          <ul className="hidden items-center gap-8 lg:flex">
            {enlacesNavegacion.map((enlace) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  className="text-sm font-medium text-stone-900 transition-colors duration-200 hover:text-amber-800"
                >
                  {enlace.etiqueta}
                </a>
              </li>
            ))}
            <li>
              <a
                href={urlWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-stone-50 transition-transform duration-200 hover:scale-[1.03] hover:bg-amber-900"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Escríbenos
              </a>
            </li>
          </ul>

          {/* Acciones (carrito + hamburguesa) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCarritoAbierto(true)}
              aria-label={`Abrir carrito, ${totalUnidades} productos`}
              className="relative rounded-full p-2 text-stone-900 transition-colors hover:bg-amber-800/10"
            >
              <ShoppingBag size={22} aria-hidden="true" />
              <AnimatePresence>
                {totalUnidades > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-800 px-1 text-[11px] font-bold text-stone-50"
                  >
                    {totalUnidades}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              className="rounded-full p-2 text-stone-900 transition-colors hover:bg-amber-800/10 lg:hidden"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* ================= Drawer móvil (pantalla completa) ================= */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="textura-toquilla-oscura fixed inset-0 z-50 flex flex-col lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <span className="font-[family-name:var(--font-display)] text-xl text-stone-50">
                Alma <span className="italic text-yellow-600">Norteña</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                className="rounded-full p-2 text-stone-50 transition-colors hover:bg-stone-50/10"
              >
                <X size={26} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Menú móvil" className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-2">
                {enlacesNavegacion.map((enlace, i) => (
                  <motion.li
                    key={enlace.href}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.07, duration: 0.35 }}
                  >
                    <a
                      href={enlace.href}
                      onClick={() => setMenuAbierto(false)}
                      className="block py-3 font-[family-name:var(--font-display)] text-3xl text-stone-50 transition-colors hover:text-yellow-600"
                    >
                      {enlace.etiqueta}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="px-8 pb-10"
            >
              <a
                href={urlWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-yellow-600 py-4 text-base font-semibold text-stone-900 transition-transform active:scale-[0.98]"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Hablar con una asesora
              </a>
              <p className="mt-4 text-center text-sm text-stone-400">
                {siteConfig.contacto.horario}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= Panel de carrito ================= */}
      <AnimatePresence>
        {carritoAbierto && (
          <>
            <motion.button
              key="overlay"
              type="button"
              aria-label="Cerrar carrito"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCarritoAbierto(false)}
              className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm"
            />
            <motion.aside
              key="carrito"
              role="dialog"
              aria-modal="true"
              aria-label="Carrito de compras"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-stone-50 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-amber-800/15 px-5 py-4">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                  Tu carrito
                </h2>
                <button
                  type="button"
                  onClick={() => setCarritoAbierto(false)}
                  aria-label="Cerrar carrito"
                  className="rounded-full p-2 text-stone-900 hover:bg-amber-800/10"
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag size={40} className="text-amber-800/40" aria-hidden="true" />
                    <p className="mt-4 text-stone-900">Tu carrito está vacío.</p>
                    <a
                      href="#coleccion"
                      onClick={() => setCarritoAbierto(false)}
                      className="mt-2 text-sm font-medium text-amber-800 underline underline-offset-4"
                    >
                      Ver la colección
                    </a>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {items.map(({ producto, cantidad }) => (
                      <li
                        key={producto.id}
                        className="flex gap-3 rounded-xl border border-amber-800/10 bg-white p-3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="text-sm font-medium text-stone-900">
                            {producto.nombre}
                          </p>
                          <p className="text-sm text-amber-800">
                            {formatearPrecio(producto.precio)}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => quitarProducto(producto.id)}
                              aria-label={`Quitar una unidad de ${producto.nombre}`}
                              className="rounded-full border border-amber-800/20 p-1 text-stone-900 hover:bg-amber-800/10"
                            >
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-stone-900">
                              {cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => agregarProducto(producto)}
                              aria-label={`Añadir una unidad de ${producto.nombre}`}
                              className="rounded-full border border-amber-800/20 p-1 text-stone-900 hover:bg-amber-800/10"
                            >
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-amber-800/15 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-900">Total</span>
                    <span className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
                      {formatearPrecio(totalSoles)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Paga con Yape al instante o coordina Plin/transferencia con
                    tu asesora.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCheckoutAbierto(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-amber-800 py-3.5 font-medium text-stone-50 transition-colors hover:bg-amber-900"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Finalizar compra
                  </button>
                  <button
                    type="button"
                    onClick={vaciarCarrito}
                    className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-sm text-stone-500 hover:text-stone-900"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Vaciar carrito
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= Checkout (Yape / coordinar pago) ================= */}
      <AnimatePresence>
        {checkoutAbierto && (
          <CheckoutModal
            items={items}
            total={totalSoles}
            onCerrar={() => setCheckoutAbierto(false)}
            onPedidoEnviado={() => {
              vaciarCarrito();
              setCheckoutAbierto(false);
              setCarritoAbierto(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
