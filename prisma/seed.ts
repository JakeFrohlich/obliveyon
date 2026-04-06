import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@obliveyon.com" },
    update: {},
    create: {
      email: "admin@obliveyon.com",
      name: "Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // Create products
  const products = [
    {
      name: "Void Hoodie",
      slug: "void-hoodie",
      description:
        "Heavyweight 450gsm cotton hoodie in deep black. Oversized fit with dropped shoulders and ribbed cuffs. Subtle embossed logo on chest.",
      price: 185,
      category: "hoodies",
      images: ["/images/placeholder-1.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: 50,
      featured: true,
    },
    {
      name: "Shadow Cargo Pants",
      slug: "shadow-cargo-pants",
      description:
        "Technical cargo pants with articulated knees and adjustable ankle cuffs. Water-resistant ripstop fabric. Multiple utility pockets with hidden zippers.",
      price: 165,
      category: "pants",
      images: ["/images/placeholder-2.jpg"],
      sizes: ["S", "M", "L", "XL"],
      stock: 35,
      featured: true,
    },
    {
      name: "Eclipse Tee",
      slug: "eclipse-tee",
      description:
        "Premium 280gsm cotton tee with oversized fit. Tonal back print with distressed finish. Pre-shrunk and garment-dyed for a lived-in feel.",
      price: 85,
      category: "tees",
      images: ["/images/placeholder-3.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: 100,
      featured: true,
    },
    {
      name: "Abyss Jacket",
      slug: "abyss-jacket",
      description:
        "Insulated technical jacket with sealed seams and storm flap. YKK zippers throughout. Detachable hood with adjustable drawcord. Reflective details at back yoke.",
      price: 320,
      category: "outerwear",
      images: ["/images/placeholder-4.jpg"],
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: true,
    },
    {
      name: "Phantom Crewneck",
      slug: "phantom-crewneck",
      description:
        "Mid-weight French terry crewneck in washed black. Relaxed fit with dropped shoulders. Embroidered logo at left chest.",
      price: 145,
      category: "hoodies",
      images: ["/images/placeholder-1.jpg"],
      sizes: ["S", "M", "L", "XL"],
      stock: 40,
      featured: false,
    },
    {
      name: "Obsidian Shorts",
      slug: "obsidian-shorts",
      description:
        "Heavyweight cotton shorts with raw-edge hem. Elastic waistband with internal drawcord. Side pockets and back welt pocket.",
      price: 95,
      category: "pants",
      images: ["/images/placeholder-2.jpg"],
      sizes: ["S", "M", "L", "XL"],
      stock: 60,
      featured: false,
    },
    {
      name: "Wraith Long Sleeve",
      slug: "wraith-long-sleeve",
      description:
        "Oversized long sleeve tee in double-layered jersey. Thumb holes at cuffs. Subtle gradient print across back panel.",
      price: 110,
      category: "tees",
      images: ["/images/placeholder-3.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: 45,
      featured: false,
    },
    {
      name: "Nether Vest",
      slug: "nether-vest",
      description:
        "Padded utility vest with matte-finish shell. High collar with magnetic closure. Four front pockets with branded hardware.",
      price: 240,
      category: "outerwear",
      images: ["/images/placeholder-4.jpg"],
      sizes: ["M", "L", "XL"],
      stock: 15,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
