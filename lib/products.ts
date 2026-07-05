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
