import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAL PROTO — Fabrikasi & Prototaip Pantas",
  description:
    "NAL PROTO menyediakan servis fabrikasi custom, prototaip pantas dan cetakan 3D profesional. Lihat produk kami dan hubungi terus untuk sebut harga.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-paper text-navy-950"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
