import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import QuoteCalculator from "@/components/QuoteCalculator";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

export default async function QuotePage() {
  const settings = await getSettings();

  let materials: Awaited<ReturnType<typeof prisma.material.findMany>> = [];
  try {
    materials = await prisma.material.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    });
  } catch {
    materials = [];
  }

  return (
    <>
      <NavBar companyName={settings.companyName} logoUrl={settings.logoUrl} />
      <main className="flex-1">
        <section className="blueprint-grid border-b border-line bg-navy-950">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <p className="font-mono text-xs uppercase tracking-widest-plus text-amber">
              Instant Estimate
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-paper md:text-5xl">
              Get a 3D Print Quote
            </h1>
            <p className="mt-3 max-w-xl font-sans text-sm text-paper-dim md:text-base">
              Upload your .stl or .3mf file, pick a material, and see an instant
              price estimate. Everything is calculated right in your browser —
              your file isn&apos;t uploaded to us until you decide to proceed.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          {materials.length === 0 ? (
            <div className="rounded-md border border-dashed border-navy-800/20 p-12 text-center">
              <p className="font-mono text-sm text-navy-900/60">
                No materials have been configured yet. Please{" "}
                <Link href="/hubungi" className="underline hover:text-amber-strong">
                  contact us
                </Link>{" "}
                directly for a quote.
              </p>
            </div>
          ) : (
            <QuoteCalculator
              materials={materials.map((m) => ({
                id: m.id,
                name: m.name,
                densityGCm3: m.densityGCm3.toString(),
                costPerGram: m.costPerGram.toString(),
              }))}
              markupMultiplier={Number(settings.quoteMarkupMultiplier)}
              minPrice={Number(settings.quoteMinPrice)}
              whatsapp={settings.whatsapp}
              companyName={settings.companyName}
            />
          )}
        </section>
      </main>
      <Footer
        companyName={settings.companyName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        instagram={settings.instagram}
        facebook={settings.facebook}
        tiktok={settings.tiktok}
      />
    </>
  );
}
