"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type EstablecimientoRecreacion = {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  direccion?: string;
  telefono?: string;
  imagen_url?: string;
  slug: string;
};

export default function EstablecimientosRecreacionAdminPage() {
  const router = useRouter();
  const [establecimientos, setEstablecimientos] = useState<
    EstablecimientoRecreacion[]
  >([]);
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
        .from("establecimientos_recreacion")
        .select(
          "id, nombre, descripcion, tipo, direccion, telefono, imagen_url, slug"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar los establecimientos.");
        console.error(error);
      } else {
        setEstablecimientos(data || []);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este establecimiento de recreación?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("establecimientos_recreacion")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setEstablecimientos(establecimientos.filter((e) => e.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar el establecimiento.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Establecimientos de Recreación</h1>
        <Link
          href="/admin/establecimientos-recreacion/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Nuevo Establecimiento
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando establecimientos...</p>
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
                <th className="px-4 py-3 border">Tipo</th>
                <th className="px-4 py-3 border">Teléfono</th>
                <th className="px-4 py-3 border">Dirección</th>
                <th className="px-4 py-3 border">Slug</th>
                <th className="px-4 py-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {establecimientos.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">
                    {item.imagen_url ? (
                      <Image
                        src={item.imagen_url}
                        alt={item.nombre}
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
                  <td className="px-4 py-2 font-semibold">{item.nombre}</td>
                  <td className="px-4 py-2">{item.descripcion || "-"}</td>
                  <td className="px-4 py-2">{item.tipo || "-"}</td>
                  <td className="px-4 py-2">{item.telefono || "-"}</td>
                  <td className="px-4 py-2">{item.direccion || "-"}</td>
                  <td className="px-4 py-2 text-xs">{item.slug}</td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <Link
                      href={`/admin/establecimientos-recreacion/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {establecimientos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    No hay establecimientos registrados.
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
