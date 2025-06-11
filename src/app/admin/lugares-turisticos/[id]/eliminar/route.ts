import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supa = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supa.auth.getSession();
  if (!session) return NextResponse.redirect(new URL("/admin/login", req.url));

  const { error } = await supa
    .from("lugares_turisticos")
    .delete()
    .eq("id", params.id);
  if (error) return new Response("Error al eliminar.", { status: 500 });

  return NextResponse.redirect(new URL("/admin/lugares-turisticos", req.url));
}
