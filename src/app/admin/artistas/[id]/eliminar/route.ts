// src/app/admin/artistas/[id]/eliminar/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// 👇 define explícitamente el tipo de context
type Context = {
  params: {
    id: string;
  };
};

export async function POST(req: NextRequest, context: Context) {
  const supabase = createRouteHandlerClient({ cookies });
  const id = context.params.id;

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
