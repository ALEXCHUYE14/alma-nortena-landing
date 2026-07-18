export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
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
