// src/app/admin/lugares-turisticos/[id]/eliminar/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supa = createRouteHandlerClient({ cookies });

  // Extraer el ID desde la URL
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2]; // obtiene el ID antes de "eliminar"

  const {
    data: { session },
  } = await supa.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { error } = await supa.from("lugares_turisticos").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar lugar turístico:", error.message);
    return new Response("Error al eliminar.", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/lugares-turisticos", req.url));
}
