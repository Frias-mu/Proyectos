// src/app/api/qr/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  if (!slug) {
    return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
  }

  try {
    const url = `${protocol}://${host}/estatuas/${encodeURIComponent(slug)}`;
    const qrImageBuffer = await QRCode.toBuffer(url, {
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
