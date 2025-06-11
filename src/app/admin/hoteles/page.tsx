"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Hotel = {
  id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  imagen_url?: string;
  slug: string;
};

export default function HotelesAdminPage() {
  const router = useRouter();
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoteles = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("hoteles")
        .select(
          "id, nombre, descripcion, direccion, telefono, imagen_url, slug"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar los hoteles.");
        console.error(error);
      } else {
        setHoteles(data || []);
      }

      setLoading(false);
    };

    fetchHoteles();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este hotel?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from("hoteles").delete().eq("id", id);
      if (error) throw error;

      setHoteles(hoteles.filter((h) => h.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar el hotel.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionar Hoteles</h1>
        <Link
          href="/admin/hoteles/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Nuevo Hotel
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando hoteles...</p>
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
                <th className="px-4 py-3 border">Dirección</th>
                <th className="px-4 py-3 border">Teléfono</th>
                <th className="px-4 py-3 border">Slug</th>
                <th className="px-4 py-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hoteles.map((hotel) => (
                <tr key={hotel.id} className="border-t">
                  <td className="px-4 py-2">
                    {hotel.imagen_url ? (
                      <Image
                        src={hotel.imagen_url}
                        alt={hotel.nombre}
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
                  <td className="px-4 py-2 font-semibold">{hotel.nombre}</td>
                  <td className="px-4 py-2">{hotel.descripcion || "-"}</td>
                  <td className="px-4 py-2">{hotel.direccion || "-"}</td>
                  <td className="px-4 py-2">{hotel.telefono || "-"}</td>
                  <td className="px-4 py-2 text-xs">{hotel.slug}</td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <Link
                      href={`/admin/hoteles/${hotel.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === hotel.id}
                    >
                      {deletingId === hotel.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {hoteles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No hay hoteles registrados.
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
