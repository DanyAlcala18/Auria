/* ============================================================
   AURIA · Catálogo
   - img: [foto con modelo, foto plana]
   - cat: leggings | flares | enteros | chamarras
   - sizes: tallas disponibles (cada una se elige por separado)
   - sizeNote: (opcional) equivalencia de la talla
   ============================================================ */
const AURIA_CONFIG = {
  // Usuario de Instagram (sin @). Perfil: https://www.instagram.com/somos_auria
  //    Si se deja vacío, los botones de Instagram copian el pedido y avisan "Muy pronto".
  instagram: "somos_auria",
  moneda: "MXN"
};

const PRODUCTS = [
  {
    id: "cacao-sculpt",
    name: "Legging Cacao Sculpt",
    cat: "leggings",
    color: "Cacao",
    hex: "#4a2c22",
    price: 499,
    sizes: ["G", "XL"],
    badge: "Más vendido",
    img: ["img/cacao-sculpt-1.jpg", "img/cacao-sculpt-2.jpg"],
    desc: "Legging de tiro alto con pretina en V que estiliza la cintura y levanta. Tela gruesa, cero transparencia y un tono cacao que combina con todo.",
    features: ["Pretina en V moldeadora", "Tela gruesa sin transparencia", "Costura trasera que realza"]
  },
  {
    id: "flare-elite",
    name: "Flare Elite Negro",
    cat: "flares",
    color: "Negro",
    hex: "#121212",
    price: 499,
    sizes: ["G", "XL"],
    badge: "Nuevo",
    img: ["img/flare-elite-1.jpg", "img/flare-elite-2.jpg"],
    desc: "El flare que va del gym al café. Pretina blanca con franjas contrastantes, corte acampanado y caída perfecta.",
    features: ["Pretina deportiva contrastante", "Corte acampanado", "Tela Elite elástica"]
  },
  {
    id: "flare-marfil",
    name: "Flare Acanalado Marfil",
    cat: "flares",
    color: "Marfil",
    hex: "#efe6d4",
    price: 499,
    sizes: ["G", "XL"],
    badge: "Modelo largo",
    img: ["img/flare-marfil-1.jpg", "img/flare-marfil-2.jpg"],
    desc: "Tela acanalada de calidad superior en un marfil luminoso. Modelo más largo, ideal para chicas altas (1.67 a 1.75 m).",
    features: ["Tela acanalada premium", "Modelo largo para altas", "Pretina alta sin costura frontal"]
  },
  {
    id: "onyx-shine",
    name: "Legging Onyx Shine",
    cat: "leggings",
    color: "Negro",
    hex: "#0e0e0e",
    price: 499,
    sizes: ["G", "XL"],
    badge: null,
    img: ["img/onyx-shine-1.jpg", "img/onyx-shine-2.jpg"],
    desc: "Negro profundo con pretina en acabado brillante tipo charol. Un básico con un detalle que se nota.",
    features: ["Pretina efecto brillo", "Costura en V trasera", "Compresión media"]
  },
  {
    id: "elite-chocolate",
    name: "Legging Elite Chocolate",
    cat: "leggings",
    color: "Chocolate",
    hex: "#5a3a2c",
    price: 499,
    sizes: ["G", "XL"],
    badge: "Con bolsas",
    img: ["img/elite-chocolate-1.jpg", "img/elite-chocolate-2.jpg"],
    desc: "Legging chocolate con pretina Elite contrastante y bolsas laterales para tu celular. Funcional y súper favorecedor.",
    features: ["Bolsas laterales", "Pretina Elite con franjas", "Tela Elite suave al tacto"]
  },
  {
    id: "dots-noir",
    name: "Legging Dots Noir",
    cat: "leggings",
    color: "Negro",
    hex: "#1a1a1a",
    price: 499,
    sizes: ["G", "XL"],
    badge: null,
    img: ["img/dots-noir-1.jpg", "img/dots-noir-2.jpg"],
    desc: "Negro con micro puntos tono sobre tono que dan textura y un efecto visual moldeador.",
    features: ["Estampado micro dots", "Tiro alto", "Tela con memoria"]
  },
  {
    id: "flare-split",
    name: "Flare Split Negro",
    cat: "flares",
    color: "Negro",
    hex: "#111",
    price: 499,
    sizes: ["M"],
    badge: "Tendencia",
    img: ["img/flare-split-1.jpg", "img/flare-split-2.jpg"],
    desc: "Flare con abertura frontal en el bajo, bolsas y pretina alta sin costura frontal. El favorito para looks de día.",
    features: ["Abertura en el bajo", "Bolsas traseras", "Sin costura frontal"]
  },
  {
    id: "flare-grafito",
    name: "Flare Acanalado Grafito",
    cat: "flares",
    color: "Grafito",
    hex: "#5b5f63",
    price: 499,
    sizes: ["S", "M"],
    badge: "Modelo largo",
    img: ["img/flare-grafito-1.jpg", "img/flare-grafito-2.jpg"],
    desc: "Tela acanalada de calidad superior en gris grafito. Modelo más largo, recomendado si mides de 1.67 a 1.75 m.",
    features: ["Tela acanalada premium", "Modelo largo para altas", "Pretina alta"]
  },
  {
    id: "stardust",
    name: "Romper Stardust",
    cat: "enteros",
    color: "Negro estrellas",
    hex: "#151515",
    price: 499,
    sizes: ["Unitalla"],
    sizeNote: "Queda a una talla 5-7",
    badge: "Edición especial",
    img: ["img/stardust-1.jpg", "img/stardust-2.jpg"],
    desc: "Romper manga larga con espalda descubierta y estrellitas brillantes. Short cortito que favorece muchísimo. Queda a una talla 5-7.",
    features: ["Espalda abierta", "Estampado de estrellas brillantes", "Short cortito"]
  },
  {
    id: "golden-zip",
    name: "Chamarra Golden Zip",
    cat: "chamarras",
    color: "Blanco",
    hex: "#f5f3ee",
    price: 499,
    sizes: ["XL"],
    badge: "Nuevo",
    img: ["img/golden-zip-1.jpg", "img/golden-zip-2.jpg"],
    desc: "Chamarra ajustada en blanco con cierres dorados al frente y en bolsas. Entallada, con orificio para el pulgar.",
    features: ["Cierres dorados", "Corte entallado", "Orificio para pulgar"]
  },
  {
    id: "crossback",
    name: "Romper Cross Back Azul",
    cat: "enteros",
    color: "Azul cielo",
    hex: "#6b82b0",
    price: 399,
    sizes: ["Unitalla"],
    sizeNote: "Queda de talla 7 a 9",
    badge: "Precio especial",
    img: ["img/crossback-1.jpg", "img/crossback-2.jpg"],
    desc: "Romper sin costuras con tirantes cruzados en la espalda y efecto levanta glúteo. Cómodo para entrenar o para el día a día.",
    features: ["Tirantes cruzados", "Tela seamless", "Efecto push-up"]
  },
  {
    id: "contour",
    name: "Jumpsuit Contour Flare",
    cat: "enteros",
    color: "Negro",
    hex: "#101010",
    price: 499,
    sizes: ["G", "XL"],
    sizeNote: "G equivale a talla 9 · XL a talla 11",
    badge: "Más vendido",
    img: ["img/contour-1.jpg", "img/contour-2.jpg"],
    desc: "Jumpsuit flare con vivos blancos que dibujan tu silueta. Material grueso y resistente. No incluye copas.",
    features: ["Vivos contorno blancos", "Material grueso", "Pierna acampanada"]
  },
  {
    id: "marino-open",
    name: "Jumpsuit Open Back Marino",
    cat: "enteros",
    color: "Azul marino",
    hex: "#1f2c55",
    price: 499,
    sizes: ["G"],
    sizeNote: "Equivale a talla 9",
    badge: null,
    img: ["img/marino-open-1.jpg", "img/marino-open-2.jpg"],
    desc: "Jumpsuit acanalado con espalda abierta en V y vivos blancos. Material grueso, cero transparencia y copas removibles.",
    features: ["Copas removibles", "Espalda abierta en V", "Cero transparencia"]
  },
  {
    id: "blush",
    name: "Legging Blush Soft",
    cat: "leggings",
    color: "Rosa blush",
    hex: "#efd3cf",
    price: 499,
    sizes: ["M", "L"],
    badge: "Nuevo",
    img: ["img/blush-1.jpg", "img/blush-2.jpg"],
    desc: "Lycra soft en rosa blush con cintura efecto faja. Suave, ligera y con bolsa lateral.",
    features: ["Lycra soft", "Cintura efecto faja", "Bolsa lateral"]
  },
  {
    id: "cargo",
    name: "Flare Cargo Chocolate",
    cat: "flares",
    color: "Chocolate",
    hex: "#4b3326",
    price: 499,
    sizes: ["Unitalla"],
    sizeNote: "Queda de talla 8 a 11",
    badge: "Tendencia",
    img: ["img/cargo-1.jpg", "img/cargo-2.jpg"],
    desc: "Flare estilo cargo con bolsas laterales con botón y sin costura frontal. Lo deportivo y lo urbano en una pieza.",
    features: ["Bolsas cargo con botón", "Sin costura frontal", "Corte flare"]
  },
  {
    id: "zip-romper",
    name: "Romper Zip Marino",
    cat: "enteros",
    color: "Azul marino",
    hex: "#22315e",
    price: 499,
    sizes: ["Unitalla"],
    sizeNote: "Queda de talla 7 a 11",
    badge: null,
    img: ["img/zip-romper-1.jpg", "img/zip-romper-2.jpg"],
    desc: "Romper manga corta con cierre frontal y cuello alto. Una sola pieza para un look completo en segundos.",
    features: ["Cierre frontal", "Cuello alto", "Manga corta"]
  },
  {
    id: "scrunch",
    name: "Legging Scrunch Negro",
    cat: "leggings",
    color: "Negro",
    hex: "#0f0f0f",
    price: 399,
    sizes: ["M"],
    sizeNote: "Equivale a talla 7/9",
    badge: "Precio especial",
    img: ["img/scrunch-1.jpg", "img/scrunch-2.jpg"],
    desc: "Legging seamless con fruncido scrunch que levanta y define. El efecto que todas buscan.",
    features: ["Fruncido scrunch", "Tela seamless", "Pretina alta en V"]
  },
  {
    id: "reflect",
    name: "Chamarra Reflect Gris",
    cat: "chamarras",
    color: "Gris",
    hex: "#7c8188",
    price: 399,
    sizes: ["G"],
    badge: "Precio especial",
    img: ["img/reflect-1.jpg", "img/reflect-2.jpg"],
    desc: "Chamarra entallada con cierre y detalles reflejantes que estilizan la cintura. Ideal para correr de noche.",
    features: ["Detalles reflejantes", "Cierre completo", "Orificio para pulgar"]
  }
];

const CATEGORIES = {
  todo: "Todo",
  leggings: "Leggings",
  flares: "Flares",
  enteros: "Jumpsuits & Rompers",
  chamarras: "Chamarras"
};
