export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  // Precio de referencia "antes de descuento". Solo se muestra la
  // etiqueta de descuento si es mayor que `precio` (evita mostrar
  // rebajas falsas cuando el campo no fue configurado).
  precio_original: number | null;
  imagen_url: string;
  categoria: string;
  stock: number;
  created_at: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export type EstadoFormulario = "idle" | "submitting" | "success" | "error";

export const DISTRITOS = [
  "Piura",
  "Catacaos",
  "Castilla",
  "Veintiséis de Octubre",
] as const;

export type Distrito = (typeof DISTRITOS)[number];
