"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";

type Lugar = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  video_url?: string;
  slug: string;
};

export default function LugaresTuristicosAdminPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select("id, nombre, descripcion, slug, imagen_url, video_url")
        .order("creado_en", { ascending: false });
      if (error) console.error(error);
      else setLugares(data || []);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este lugar turístico?")) return;
    setDeletingId(id);
    const { error } = await supabase
      .from("lugares_turisticos")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
    else setLugares((s) => s.filter((l) => l.id !== id));
    setDeletingId(null);
  };

  if (loading) return <p className="p-4 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lugares Turísticos</h1>
        <Link
          href="/admin/lugares-turisticos/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Lugar
        </Link>
      </div>

      <table className="w-full table-auto border bg-white rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Imagen</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Video</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lugares.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center">
                No hay registros.
              </td>
            </tr>
          )}
          {lugares.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">
                {l.imagen_url ? (
                  <Image
                    src={l.imagen_url}
                    alt={l.nombre}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                )}
              </td>
              <td className="p-2 font-medium">{l.nombre}</td>
              <td className="p-2 text-sm text-gray-700 max-w-xs truncate">
                {l.descripcion || "-"}
              </td>
              <td className="p-2">
                {l.video_url ? (
                  <a
                    href={l.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 text-xs">{l.slug}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/lugares-turisticos/${l.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </Link>
                <button
                  disabled={deletingId === l.id}
                  onClick={() => handleDelete(l.id)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === l.id ? "Eliminando..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
