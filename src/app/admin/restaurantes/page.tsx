"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type Restaurante = {
  id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  imagen_url?: string;
  slug: string;
};

export default function RestaurantesAdminPage() {
  const router = useRouter();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("restaurantes")
        .select(
          "id, nombre, descripcion, direccion, telefono, imagen_url, slug"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar los restaurantes.");
        console.error(error);
      } else {
        setRestaurantes(data || []);
      }

      setLoading(false);
    };

    fetchRestaurantes();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este restaurante?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("restaurantes")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setRestaurantes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar el restaurante.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Gestión de Restaurantes
        </h1>
        <Link
          href="/admin/restaurantes/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm shadow"
        >
          + Nuevo Restaurante
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando restaurantes...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {restaurantes.map((restaurante) => (
                <tr
                  key={restaurante.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">
                    {restaurante.imagen_url ? (
                      <Image
                        src={restaurante.imagen_url}
                        alt={restaurante.nombre}
                        width={60}
                        height={60}
                        className="rounded-md object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-300 rounded">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {restaurante.nombre}
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {restaurante.descripcion || "-"}
                  </td>
                  <td className="px-4 py-2">{restaurante.direccion || "-"}</td>
                  <td className="px-4 py-2">{restaurante.telefono || "-"}</td>
                  <td className="px-4 py-2 text-xs">{restaurante.slug}</td>
                  <td className="px-4 py-2 space-x-3">
                    <Link
                      href={`/admin/restaurantes/${restaurante.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(restaurante.id)}
                      disabled={deletingId === restaurante.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === restaurante.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {restaurantes.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No hay restaurantes registrados.
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
