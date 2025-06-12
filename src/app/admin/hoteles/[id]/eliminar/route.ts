// src/app/admin/hoteles/[id]/eliminar/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Extraer el ID desde la URL
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2]; // se asume la estructura /admin/hoteles/[id]/eliminar

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { error } = await supabase.from("hoteles").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar hotel:", error.message);
    return new Response("Error al eliminar", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/hoteles", req.url));
}
