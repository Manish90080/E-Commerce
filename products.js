export const products = [
  {
    id: "arc-watch",
    name: "Arc watch",
    category: "wear",
    label: "Bestseller",
    price: 148,
    color: "Sage / brushed steel",
    image: "photo-1523275335684-37898b6baf30",
    description: "A pared-back timepiece with a soft-touch strap and quietly precise movement. Made to be worn every day.",
  },
  {
    id: "everyday-tote",
    name: "Everyday tote",
    category: "wear",
    label: "Made to last",
    price: 64,
    color: "Natural canvas",
    image: "photo-1590874103328-eac38a683ce7",
    description: "A dependable carryall cut from sturdy recycled cotton canvas, with just enough room for the day ahead.",
  },
  {
    id: "studio-headphones",
    name: "Studio headphones",
    category: "objects",
    label: "New in",
    price: 189,
    color: "Warm white",
    image: "photo-1505740420928-5e560c06d30e",
    description: "Considered sound, comfortable listening. A balanced wireless headphone built for long, unrushed days.",
  },
  {
    id: "weekend-camera",
    name: "Weekend camera",
    category: "objects",
    label: "",
    price: 229,
    color: "Silver / charcoal",
    image: "photo-1516035069371-29a1b244cc32",
    description: "A simple, pocketable point-and-shoot that helps you spend less time setting up and more time looking around.",
  },
  {
    id: "soft-chair",
    name: "Soft form chair",
    category: "home",
    label: "Small-batch",
    price: 320,
    color: "Natural oak",
    image: "photo-1503602642458-232111445657",
    description: "Thoughtful proportions, solid oak legs, and a generously curved seat. Designed to feel at home anywhere.",
  },
  {
    id: "table-light",
    name: "Table light",
    category: "home",
    label: "",
    price: 116,
    color: "Soft white",
    image: "photo-1507473885765-e6ed057f782c",
    description: "A warm pool of light for slow mornings and late evenings, with a tactile ceramic base and linen shade.",
  },
  {
    id: "field-sneaker",
    name: "Field sneaker",
    category: "wear",
    label: "Bestseller",
    price: 120,
    color: "Chalk / moss",
    image: "photo-1542291026-7eec264c27ff",
    description: "An easy-wearing everyday sneaker with a recycled knit upper, natural rubber sole, and a lighter step.",
  },
  {
    id: "reading-glasses",
    name: "Reading glasses",
    category: "objects",
    label: "",
    price: 82,
    color: "Tortoise",
    image: "photo-1511499767150-a48a237f0083",
    description: "Lightweight, balanced frames with a subtle shape that suits every day. Made with durable plant-based acetate.",
  },
];

export const categories = [
  { id: "all", name: "All things", description: "A considered collection for the everyday." },
  { id: "home", name: "Home", description: "A softer place to land." },
  { id: "wear", name: "Wear", description: "Good things, close at hand." },
  { id: "objects", name: "Objects", description: "Useful things worth keeping." },
];

export const imageUrl = (image, width = 720) =>
  `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=78`;

export const money = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
