// src/app/api/qr/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const slug = urlParts[urlParts.length - 1];
  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  if (!slug) {
    return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
  }

  try {
    const qrUrl = `${protocol}://${host}/estatuas/${encodeURIComponent(slug)}`;
    const qrImageBuffer = await QRCode.toBuffer(qrUrl, {
      type: "png",
      width: 300,
      errorCorrectionLevel: "H",
    });

    return new NextResponse(qrImageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${slug}-qr.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error al generar QR:", error);
    return NextResponse.json(
      { error: "No se pudo generar el código QR" },
      { status: 500 }
    );
  }
}
