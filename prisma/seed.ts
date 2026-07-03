import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@nalproto.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ubahsaya123";

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: { name: "Admin NAL PROTO", email: adminEmail, passwordHash },
    });
    console.log(`Akaun admin dicipta -> ${adminEmail} / ${adminPassword}`);
    console.log("PENTING: tukar kata laluan ini sebaik sahaja log masuk kali pertama.");
  } else {
    console.log("Akaun admin sudah wujud, langkau.");
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyName: "NAL PROTO",
      tagline: "Prototaip. Fabrikasi. Selesai.",
      aboutText:
        "NAL PROTO menyediakan perkhidmatan reka bentuk dan fabrikasi prototaip — dari cetakan 3D, pemasangan litar, hingga kerja pembaikan teknikal. Kami bantu jadikan idea anda sesuatu yang boleh dipegang.",
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
      name: "Cetakan 3D Custom (PLA)",
      slug: "cetakan-3d-custom-pla",
      category: "Cetakan 3D",
      description:
        "Perkhidmatan cetakan 3D custom menggunakan filamen PLA berkualiti. Sesuai untuk prototaip, part ganti, dan hiasan. Hantar fail STL anda dan kami uruskan selebihnya.",
      price: 25.0,
      sku: "P3D-PLA-001",
      stock: 100,
      isFeatured: true,
    },
    {
      name: "Reka Bentuk & Prototaip Produk",
      slug: "reka-bentuk-prototaip-produk",
      category: "Servis Prototaip",
      description:
        "Servis reka bentuk CAD dan fabrikasi prototaip fungsional dari konsep hingga siap. Termasuk sesi konsultasi dan semakan reka bentuk.",
      price: 350.0,
      sku: "SVC-PROTO-001",
      stock: null,
      isFeatured: true,
    },
    {
      name: "Spool Holder Bambu Lab",
      slug: "spool-holder-bambu-lab",
      category: "Aksesori Printer",
      description:
        "Spool holder tambahan yang direka khas untuk printer Bambu Lab. Kukuh, mudah pasang, dan menjimatkan ruang meja kerja anda.",
      price: 18.0,
      sku: "ACC-SPOOL-001",
      stock: 40,
      isFeatured: false,
    },
    {
      name: "Pembaikan & Diagnostik Litar",
      slug: "pembaikan-diagnostik-litar",
      category: "Servis Pembaikan",
      description:
        "Servis diagnostik dan pembaikan litar elektronik untuk peranti IoT, papan pengawal, dan prototaip hardware anda.",
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

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
