import { supabase } from "@/lib/supabaseClient";

export default async function LugarDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Awaita params antes de destructurar
  const { slug } = await params;

  const { data: lugar, error } = await supabase
    .from("lugares_turisticos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!lugar) return <div className="p-6">Lugar no encontrado.</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">{lugar.nombre}</h1>

      {lugar.imagen_url && (
        <img
          src={lugar.imagen_url}
          alt={`Imagen de ${lugar.nombre}`}
          className="rounded-lg shadow mb-6 w-full object-cover max-h-[400px]"
        />
      )}

      {lugar.descripcion && (
        <p className="text-gray-700 text-base leading-relaxed mb-6 whitespace-pre-line">
          {lugar.descripcion}
        </p>
      )}

      {lugar.video_url && (
        <div className="aspect-video w-full mt-6">
          <iframe
            src={lugar.video_url}
            title={`Video de ${lugar.nombre}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded border"
          />
        </div>
      )}
    </main>
  );
}
