import { NextResponse } from "next/server";
import { getSettings } from "@/lib/get-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${settings.companyName}`,
    `ORG:${settings.companyName}`,
    settings.phone ? `TEL;TYPE=WORK,VOICE:${settings.phone}` : "",
    settings.email ? `EMAIL:${settings.email}` : "",
    settings.address ? `ADR;TYPE=WORK:;;${settings.address}` : "",
    settings.instagram ? `URL:${settings.instagram}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${settings.companyName.replace(/\s+/g, "-")}.vcf"`,
    },
  });
}
