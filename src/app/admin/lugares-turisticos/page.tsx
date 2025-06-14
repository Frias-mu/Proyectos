"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type LugarTuristico = {
  id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  imagen_principal?: string;
  video_url?: string;
  categoria?: string;
  abierto_24h?: boolean;
  galeria?: string[];
};

export default function LugaresTuristicosAdminPage() {
  const router = useRouter();
  const [lugares, setLugares] = useState<LugarTuristico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLugares = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select(
          "id, nombre, descripcion, slug, imagen_principal, video_url, categoria, abierto_24h, galeria"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar los lugares turísticos.");
        console.error(error);
      } else {
        setLugares(data || []);
      }

      setLoading(false);
    };

    fetchLugares();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este lugar?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("lugares_turisticos")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setLugares((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar el lugar.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Gestión de Lugares Turísticos
        </h1>
        <Link
          href="/admin/lugares-turisticos/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm shadow-sm transition"
        >
          + Nuevo Lugar
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-700 text-sm">Cargando lugares...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Video</th>
                <th className="px-4 py-3 text-center">24h</th>
                <th className="px-4 py-3 text-center">Galería</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lugares.map((lugar) => (
                <tr
                  key={lugar.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">
                    {lugar.imagen_principal ? (
                      <Image
                        src={lugar.imagen_principal}
                        alt={lugar.nombre}
                        width={60}
                        height={60}
                        className="rounded-md object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {lugar.nombre}
                  </td>
                  <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">
                    {lugar.descripcion || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {lugar.slug}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {lugar.categoria || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {lugar.video_url ? (
                      <a
                        href={lugar.video_url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Ver video
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {lugar.abierto_24h ? "✔️" : "—"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {lugar.galeria?.length ?? 0}
                  </td>
                  <td className="px-4 py-2 space-x-3">
                    <Link
                      href={`/admin/lugares-turisticos/${lugar.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(lugar.id)}
                      disabled={deletingId === lugar.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === lugar.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {lugares.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-6">
                    No hay lugares registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Link
        href="/admin"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1 mb-4"
      >
        ← Volver al panel
      </Link>
    </div>
  );
}
