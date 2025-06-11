"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type Artista = {
  id: string;
  nombre: string;
  biografia?: string;
  imagen_url?: string;
  slug: string;
  video_url?: string;
  redes_sociales?: Record<string, string>;
};

export default function ArtistasAdminPage() {
  const router = useRouter();
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistas = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("artistas")
        .select(
          "id, nombre, biografia, imagen_url, slug, video_url, redes_sociales"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar los artistas.");
        console.error(error);
      } else {
        setArtistas(data || []);
      }

      setLoading(false);
    };

    fetchArtistas();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este artista?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from("artistas").delete().eq("id", id);
      if (error) throw error;

      setArtistas(artistas.filter((a) => a.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar el artista.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionar Artistas</h1>
        <Link
          href="/admin/artistas/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Nuevo Artista
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando artistas...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-md">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Imagen</th>
                <th className="px-4 py-3 border">Nombre</th>
                <th className="px-4 py-3 border">Biografía</th>
                <th className="px-4 py-3 border">Slug</th>
                <th className="px-4 py-3 border">Video</th>
                <th className="px-4 py-3 border">Redes</th>
                <th className="px-4 py-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {artistas.map((artista) => (
                <tr key={artista.id} className="border-t">
                  <td className="px-4 py-2">
                    {artista.imagen_url ? (
                      <Image
                        src={artista.imagen_url}
                        alt={artista.nombre}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-semibold">{artista.nombre}</td>
                  <td className="px-4 py-2">{artista.biografia || "-"}</td>
                  <td className="px-4 py-2 text-xs">{artista.slug}</td>
                  <td className="px-4 py-2 text-xs">
                    {artista.video_url ? (
                      <a
                        href={artista.video_url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Ver video
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {artista.redes_sociales
                      ? Object.entries(artista.redes_sociales)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <Link
                      href={`/admin/artistas/${artista.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(artista.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === artista.id}
                    >
                      {deletingId === artista.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {artistas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No hay artistas registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
