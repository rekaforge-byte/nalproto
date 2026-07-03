import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@nalproto.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ubahsaya123";

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: { name: "Admin NAL PROTO", email: adminEmail, passwordHash },
    });
    console.log(`Admin account created -> ${adminEmail} / ${adminPassword}`);
    console.log("IMPORTANT: change this password as soon as you log in for the first time.");
  } else {
    console.log("Admin account already exists, skipping.");
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyName: "NAL PROTO",
      tagline: "From Concept to Creation",
      aboutText:
        "NAL PROTO provides design and prototype fabrication services — from 3D printing and circuit assembly to technical repair work. We help turn your ideas into something you can hold.",
      phone: "+60 12-345 6789",
      whatsapp: "60123456789",
      email: "hello@nalproto.com",
      address: "Seremban, Negeri Sembilan, Malaysia",
      instagram: "https://instagram.com/nalproto",
      facebook: "",
      tiktok: "",
    },
    update: {},
  });

  const sampleProducts = [
    {
      name: "Custom 3D Print (PLA)",
      slug: "cetakan-3d-custom-pla",
      category: "3D Printing",
      description:
        "Custom 3D printing service using quality PLA filament. Great for prototypes, replacement parts, and decorative pieces. Send us your STL file and we'll handle the rest.",
      price: 25.0,
      sku: "P3D-PLA-001",
      stock: 100,
      isFeatured: true,
    },
    {
      name: "Product Design & Prototyping",
      slug: "reka-bentuk-prototaip-produk",
      category: "Prototype Services",
      description:
        "CAD design and functional prototype fabrication service from concept to completion. Includes consultation sessions and design reviews.",
      price: 350.0,
      sku: "SVC-PROTO-001",
      stock: null,
      isFeatured: true,
    },
    {
      name: "Bambu Lab Spool Holder",
      slug: "spool-holder-bambu-lab",
      category: "Printer Accessories",
      description:
        "Additional spool holder designed specifically for Bambu Lab printers. Sturdy, easy to install, and saves desk space.",
      price: 18.0,
      sku: "ACC-SPOOL-001",
      stock: 40,
      isFeatured: false,
    },
    {
      name: "Circuit Repair & Diagnostics",
      slug: "pembaikan-diagnostik-litar",
      category: "Repair Services",
      description:
        "Electronic circuit diagnostic and repair service for IoT devices, control boards, and hardware prototypes.",
      price: 60.0,
      sku: "SVC-REPAIR-001",
      stock: null,
      isFeatured: false,
    },
  ];

  for (const p of sampleProducts) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({ data: p });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
