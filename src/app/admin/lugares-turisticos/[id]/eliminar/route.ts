// src/app/admin/lugares-turisticos/[id]/eliminar/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const { data, error: fetchError } = await supabase
    .from("lugares_turisticos")
    .select("imagen_principal, galeria")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error al obtener lugar:", fetchError.message);
    return new Response("Error al obtener datos", { status: 500 });
  }

  const filesToDelete: string[] = [];

  if (data.imagen_principal) {
    const mainPath = decodeURIComponent(
      new URL(data.imagen_principal).pathname.replace(
        "/storage/v1/object/public/imagenes/",
        ""
      )
    );
    filesToDelete.push(mainPath);
  }

  if (data.galeria && Array.isArray(data.galeria)) {
    data.galeria.forEach((url: string) => {
      const path = decodeURIComponent(
        new URL(url).pathname.replace("/storage/v1/object/public/imagenes/", "")
      );
      filesToDelete.push(path);
    });
  }

  if (filesToDelete.length > 0) {
    await supabase.storage.from("imagenes").remove(filesToDelete);
  }

  const { error: deleteError } = await supabase
    .from("lugares_turisticos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error al eliminar lugar:", deleteError.message);
    return new Response("Error al eliminar", { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/lugares-turisticos", req.url));
}
