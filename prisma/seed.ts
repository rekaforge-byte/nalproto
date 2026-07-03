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
      quoteMarkupMultiplier: 3.0,
      quoteMinPrice: 5.0,
    },
    update: {},
  });

  const defaultServices = [
    {
      title: "3D Printing",
      description: "Custom prototypes and parts, from STL file to object in your hands.",
      position: 1,
    },
    {
      title: "Product Design",
      description: "CAD, technical sketches, and design reviews before fabrication.",
      position: 2,
    },
    {
      title: "Prototype Fabrication",
      description: "From concept to a functional model ready for testing.",
      position: 3,
    },
    {
      title: "Technical Repair",
      description: "Diagnostics and repair for circuits, hardware, and IoT devices.",
      position: 4,
    },
  ];

  for (const s of defaultServices) {
    const exists = await prisma.service.findFirst({ where: { title: s.title } });
    if (!exists) await prisma.service.create({ data: s });
  }

  const defaultMaterials = [
    { name: "PLA", densityGCm3: 1.24, costPerGram: 0.08, position: 1 },
    { name: "PETG", densityGCm3: 1.27, costPerGram: 0.09, position: 2 },
    { name: "ABS", densityGCm3: 1.04, costPerGram: 0.08, position: 3 },
    { name: "TPU (Flexible)", densityGCm3: 1.21, costPerGram: 0.12, position: 4 },
  ];

  for (const m of defaultMaterials) {
    const exists = await prisma.material.findFirst({ where: { name: m.name } });
    if (!exists) await prisma.material.create({ data: m });
  }

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
