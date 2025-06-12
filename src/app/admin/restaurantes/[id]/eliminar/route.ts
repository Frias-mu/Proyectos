// src/app/admin/restaurantes/[id]/eliminar/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Extraer el ID desde la URL
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2]; // debe capturar el id en /admin/restaurantes/[id]/eliminar

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { error } = await supabase.from("restaurantes").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar restaurante:", error.message);
    return new Response("Error al eliminar", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/restaurantes", req.url));
}
