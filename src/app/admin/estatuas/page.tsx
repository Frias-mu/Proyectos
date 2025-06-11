"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type Estatua = {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha?: string;
  imagen_url?: string;
  ubicacion?: string;
  slug: string;
  latitud?: number;
  longitud?: number;
};

export default function EstatuasAdminPage() {
  const router = useRouter();
  const [estatuas, setEstatuas] = useState<Estatua[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("estatuas")
        .select(
          "id, nombre, descripcion, fecha, imagen_url, ubicacion, slug, latitud, longitud"
        )
        .order("fecha", { ascending: false });

      if (error) {
        setError("Error al cargar las estatuas.");
        console.error(error);
      } else {
        setEstatuas(data || []);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta estatua?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from("estatuas").delete().eq("id", id);
      if (error) throw error;

      setEstatuas(estatuas.filter((e) => e.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar la estatua.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionar Estatuas</h1>
        <Link
          href="/admin/estatuas/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Nueva Estatua
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando estatuas...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-md">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Imagen</th>
                <th className="px-4 py-3 border">Nombre</th>
                <th className="px-4 py-3 border">Descripción</th>
                <th className="px-4 py-3 border">Ubicación</th>
                <th className="px-4 py-3 border">Fecha</th>
                <th className="px-4 py-3 border">Slug</th>
                <th className="px-4 py-3 border">Coordenadas</th>
                <th className="px-4 py-3 border">Acciones</th>
                <th className="px-4 py-3 border">QR</th>
              </tr>
            </thead>
            <tbody>
              {estatuas.map((estatua) => (
                <tr key={estatua.id} className="border-t">
                  <td className="px-4 py-2">
                    {estatua.imagen_url ? (
                      <Image
                        src={estatua.imagen_url}
                        alt={estatua.nombre}
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
                  <td className="px-4 py-2 font-semibold">{estatua.nombre}</td>
                  <td className="px-4 py-2">{estatua.descripcion || "-"}</td>
                  <td className="px-4 py-2">{estatua.ubicacion || "-"}</td>
                  <td className="px-4 py-2">
                    {estatua.fecha
                      ? new Date(estatua.fecha).toLocaleDateString("es-PE")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">{estatua.slug}</td>
                  <td className="px-4 py-2 text-xs">
                    {estatua.latitud && estatua.longitud
                      ? `${estatua.latitud}, ${estatua.longitud}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <Link
                      href={`/admin/estatuas/${estatua.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(estatua.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === estatua.id}
                    >
                      {deletingId === estatua.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center space-y-1 text-sm">
                    <a
                      href={`/api/qr/${estatua.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      Ver QR
                    </a>
                    <a
                      href={`/api/qr/${estatua.slug}`}
                      download={`${estatua.slug}-qr.png`}
                      className="text-green-600 hover:underline block"
                    >
                      Descargar
                    </a>
                  </td>
                </tr>
              ))}
              {estatuas.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-6">
                    No hay estatuas registradas.
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
