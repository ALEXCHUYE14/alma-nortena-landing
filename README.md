# Alma Norteña — Landing E-commerce Premium

Landing page B2C de moda y joyería fina para el público femenino de **Piura Metropolitana y Catacaos**, construida con Next.js 15 (App Router), React 19, TypeScript estricto, Tailwind CSS v4, Supabase (`@supabase/ssr`) y Framer Motion.

## Concepto de diseño

**"Calidez Dorada y Elegancia Ancestral"** — minimalismo moderno fusionado con la identidad de Catacaos:

- **Textura de paja toquilla:** trama diagonal cruzada sutil (CSS) en hero, sección de historia y footer.
- **Divisor de filigrana:** ornamento SVG original con espirales y granetería, inspirado en la orfebrería catacaense, que separa cada sección.
- **Paleta:** `stone-50` (fondo), `amber-800` (identidad/tierra), `yellow-600` (oro/filigrana), `stone-900` (texto).
- **Tipografía:** Playfair Display (títulos) + Inter (cuerpo), vía `next/font`.

## Estructura del proyecto

```
├── app/
│   ├── globals.css          # Tailwind v4 (@theme), texturas, skeleton shimmer
│   ├── layout.tsx           # Fuentes, metadatos SEO local, CartProvider
│   └── page.tsx             # Server Component + Suspense + fetch Supabase
├── components/
│   ├── CartProvider.tsx     # Contexto de carrito (estado compartido)
│   ├── Navbar.tsx           # Header fijo, drawer móvil animado, panel carrito
│   ├── Hero.tsx             # Composición asimétrica + CTAs
│   ├── ProductGrid.tsx      # Grid + skeletons + badges dinámicos
│   ├── LeadForm.tsx         # Suscripción con estados idle/submitting/success/error
│   ├── Footer.tsx           # Contacto, políticas, Yape/Plin/transferencias
│   └── Filigrana.tsx        # Ornamento SVG (firma visual)
├── lib/
│   ├── config.ts            # Datos del negocio (WhatsApp, dirección, redes)
│   ├── types.ts             # Tipos compartidos
│   └── supabase/
│       ├── server.ts        # Cliente para Server Components (Next 15)
│       └── client.ts        # Cliente para el navegador
└── supabase/
    └── schema.sql           # Tablas + RLS + seed de 8 productos
```

## Puesta en marcha

### 1. Base de datos

En el dashboard de Supabase → **SQL Editor**, ejecuta el contenido completo de `supabase/schema.sql`. Esto crea las tablas `productos` y `leads_suscritos`, activa RLS y carga 8 productos de ejemplo.

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completa con los valores de tu proyecto (Dashboard → Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Datos del negocio

Edita `lib/config.ts` una sola vez: número de WhatsApp, dirección, correo y redes. Todo el sitio se actualiza automáticamente.

### 4. Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Seguridad (RLS)

| Tabla | SELECT anónimo | INSERT anónimo | UPDATE/DELETE anónimo |
|---|---|---|---|
| `productos` | ✅ Permitido | ❌ Denegado | ❌ Denegado |
| `leads_suscritos` | ❌ Denegado (privacidad de correos) | ✅ Permitido | ❌ Denegado |

Los correos de los suscriptores **no pueden leerse** con la anon key: la protección está a nivel de base de datos.

## Rendimiento y SEO

- Fetch de productos 100% en servidor (`app/page.tsx`) con **ISR** (`revalidate = 60`).
- Streaming con `<Suspense>`: el hero pinta de inmediato y el grid muestra skeletons mientras responde Supabase.
- Metadatos locales (`es_PE`, geo tags PE-PIU, Open Graph, canonical).
- `next/image` con `sizes` responsivos y dominio de Supabase Storage ya permitido en `next.config.ts`.
- Accesibilidad: foco visible, `prefers-reduced-motion`, roles ARIA en drawer/carrito, cierre con Escape.
