// products.ts
export type StockStatus = "disponible" | "ultimas-unidades" | "agotado";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  colors: string[];
  sizes: string[];
  unavailableSizes?: string[];
  stock: StockStatus;
  stockCount?: number;
  isNew?: boolean;
  gradient: string; // placeholder image gradient
  image: string;
  images?: string[]; 
  description: string;
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "chompa-qhata",
    name: "Chompa Qhata",
    subtitle: "Trenzado clásico",
    price: 420,
    colors: ["#a08e6c", "#3a4032", "#7A7066", "#1d1611"],
    sizes: ["S", "M", "L", "XL"],
    unavailableSizes: ["XL"],
    stock: "disponible",
    stockCount: 8,
    isNew: true,
    gradient: "linear-gradient(160deg,#d9cdb0,#a08e6c)",
    image: "/products/chompa-qhata.jpg",
    images: ["/products/chompa-qhata.jpg"],
    description:
      "Tejido a mano con fibra de alpaca cusqueña. Diseño trenzado tradicional reinterpretado con corte contemporáneo.",
    rating: 5,
    reviewCount: 34,
  },
  {
    id: "poncho-inti",
    name: "Poncho Inti",
    subtitle: "Edición limitada",
    price: 580,
    colors: ["#867453", "#211712", "#C9A876"],
    sizes: ["S", "M", "L"],
    stock: "disponible",
    stockCount: 5,
    gradient: "linear-gradient(160deg,#cabb98,#867453)",
    image: "/products/poncho-inti.jpg",
    images: ["/products/poncho-inti.jpg"],
    description:
      "Poncho de edición limitada tejido por maestras artesanas de la comunidad de Chinchero, con motivos geométricos andinos.",
    rating: 5,
    reviewCount: 21,
  },
  {
    id: "bufanda-wayra",
    name: "Bufanda Wayra",
    subtitle: "Tejido fino",
    price: 190,
    colors: ["#b09c76", "#3a4032", "#1d1611", "#7A7066"],
    sizes: ["Única"],
    stock: "disponible",
    stockCount: 14,
    gradient: "linear-gradient(160deg,#e3d6b8,#b09c76)",
    image: "/products/bufanda-wayra.jpg",
    images: ["/products/bufanda-wayra.jpg"],
    description:
      "Bufanda ligera de tejido fino, ideal para todo el año. Suavidad excepcional gracias a la fibra de alpaca baby.",
    rating: 4,
    reviewCount: 18,
  },
  {
    id: "saco-yawar",
    name: "Saco Yawar",
    subtitle: "Corte moderno",
    price: 510,
    colors: ["#74633f", "#211712"],
    sizes: ["S", "M", "L"],
    stock: "ultimas-unidades",
    stockCount: 2,
    gradient: "linear-gradient(160deg,#bba87f,#74633f)",
    image: "/products/saco-yawar.jpg",
    images: ["/products/saco-yawar.jpg"],
    description:
      "Saco de corte moderno y silueta estructurada, perfecto para climas fríos sin perder elegancia urbana.",
    rating: 5,
    reviewCount: 12,
  },
  {
    id: "gorro-sami",
    name: "Gorro Sami",
    subtitle: "Unisex",
    price: 130,
    colors: ["#92805c", "#3a4032", "#1d1611"],
    sizes: ["Única"],
    stock: "disponible",
    stockCount: 22,
    gradient: "linear-gradient(160deg,#d2c2a0,#92805c)",
    image: "/products/gorro-sami.jpg",
    images: ["/products/gorro-sami.jpg"],
    description:
      "Gorro unisex tejido a mano, abrigador y liviano. Combina con cualquier outfit de temporada.",
    rating: 5,
    reviewCount: 9,
  },
  {
    id: "manta-killa",
    name: "Manta Killa",
    subtitle: "Edición especial",
    price: 350,
    colors: ["#c9beac"],
    sizes: ["Única"],
    stock: "agotado",
    stockCount: 0,
    gradient: "linear-gradient(160deg,#c9beac,#8c7f68)",
    image: "/products/manta-killa.jpg",
    images: ["/products/manta-killa.jpg"],
    description:
      "Manta de edición especial inspirada en los patrones lunares de la cosmovisión andina.",
    rating: 5,
    reviewCount: 27,
  },
  {
    id: "chalina-puma",
    name: "Chalina Puma",
    subtitle: "Doble vista",
    price: 240,
    colors: ["#211712", "#a08e6c", "#7A7066"],
    sizes: ["Única"],
    stock: "disponible",
    stockCount: 11,
    gradient: "linear-gradient(160deg,#cabb98,#5c5142)",
    image: "/products/chalina-puma.jpg",
    images: ["/products/chalina-puma.jpg"],
    description:
      "Chalina reversible de doble vista, dos texturas y dos colores en una sola prenda versátil.",
    rating: 4,
    reviewCount: 15,
  },
];

export const testimonials = [
  {
    quote:
      "La calidad de la alpaca es excepcional. Se siente el cuidado en cada detalle.",
    author: "Valeria M.",
    location: "Lima",
  },
  {
    quote:
      "Saber que apoyo comunidades andinas hace que valga aún más la pena.",
    author: "Renzo T.",
    location: "Cusco",
  },
  {
    quote:
      "Pedí una chompa para el invierno y superó cualquier expectativa de abrigo y diseño.",
    author: "Camila S.",
    location: "Arequipa",
  },
];
// ─────────────────────────────────────────────
// Adaptador: respuesta del backend Express → tipo Product
// ─────────────────────────────────────────────
import { API_URL } from "./api";

interface InventarioAPI {
  id: number;
  talla: string;
  color: string | null;
  stock: number;
}

interface ProductoAPI {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_oferta: string | null;
  tipo: string | null;
  categoria: string | null;
  destacado: boolean;
  imagen_principal: string | null;
  stock_total?: number;
  inventario?: InventarioAPI[];
  imagenes?: { url: string; es_principal: boolean }[];
}

export function adaptarProducto(p: ProductoAPI): Product {
  const inventario = p.inventario || [];
  const tallasUnicas = [...new Set(inventario.map(i => i.talla))];
  const coloresUnicos = [...new Set(inventario.filter(i => i.color).map(i => i.color as string))];
  const tallasConStock = new Set(inventario.filter(i => i.stock > 0).map(i => i.talla));
  const unavailableSizes = tallasUnicas.filter(t => !tallasConStock.has(t));

  // Si viene inventario detallado (vista de detalle), calcula desde ahí.
  // Si no (vista de listado/catálogo), usa el stock_total que trae el propio listado.
  const totalStock = inventario.length > 0
    ? inventario.reduce((sum, i) => sum + i.stock, 0)
    : (p.stock_total ?? 0);

  const estado: StockStatus = totalStock === 0 ? "agotado" : totalStock <= 3 ? "ultimas-unidades" : "disponible";

  const imagenPrincipal = p.imagen_principal || p.imagenes?.find(i => i.es_principal)?.url || "";
  const todasImagenes = p.imagenes?.map(i => i.url) || (imagenPrincipal ? [imagenPrincipal] : []);

  return {
    id: p.id,
    name: p.nombre,
    subtitle: p.tipo || "",
    price: Number(p.precio_oferta || p.precio),
    colors: coloresUnicos.length > 0 ? coloresUnicos : ["#a08e6c"],
    sizes: tallasUnicas,
    unavailableSizes: unavailableSizes.length > 0 ? unavailableSizes : undefined,
    stock: estado,
    stockCount: totalStock,
    isNew: p.destacado,
    gradient: `linear-gradient(160deg,#d9cdb0,${coloresUnicos[0] || "#a08e6c"})`,
    image: imagenPrincipal,
    images: todasImagenes,
    description: p.descripcion,
    rating: 5,
    reviewCount: 0,
  };
}

export async function fetchProductos(params?: {
  tipo?: string; talla?: string; color?: string; sort?: string; page?: number; pageSize?: number;
}): Promise<{ productos: Product[]; total: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.tipo) query.set("tipo", params.tipo);
  if (params?.talla) query.set("talla", params.talla);
  if (params?.color) query.set("color", params.color);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));

  const res = await fetch(`${API_URL}/productos?${query.toString()}`);
  const data = await res.json();
  return {
    productos: (data.productos || []).map(adaptarProducto),
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
}

export async function fetchProducto(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return adaptarProducto(data);
}