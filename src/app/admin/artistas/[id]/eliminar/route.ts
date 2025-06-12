import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Extraer el ID desde la URL manualmente
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { error } = await supabase.from("artistas").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar artista:", error.message);
    return new Response("Error al eliminar", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/artistas", req.url));
}
