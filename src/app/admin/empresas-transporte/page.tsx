"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type EmpresaTransporte = {
  id: string;
  nombre: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  imagen_url?: string;
  slug: string;
};

export default function EmpresasTransporteAdminPage() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<EmpresaTransporte[]>([]);
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
        .from("empresas_transporte")
        .select(
          "id, nombre, descripcion, telefono, direccion, imagen_url, slug"
        )
        .order("nombre", { ascending: true });

      if (error) {
        setError("Error al cargar las empresas.");
        console.error(error);
      } else {
        setEmpresas(data || []);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta empresa de transporte?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("empresas_transporte")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setEmpresas(empresas.filter((e) => e.id !== id));
    } catch (err) {
      alert("Ocurrió un error al eliminar la empresa.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Empresas de Transporte</h1>
        <Link
          href="/admin/empresas-transporte/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Nueva Empresa
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando empresas...</p>
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
                <th className="px-4 py-3 border">Teléfono</th>
                <th className="px-4 py-3 border">Dirección</th>
                <th className="px-4 py-3 border">Slug</th>
                <th className="px-4 py-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="border-t">
                  <td className="px-4 py-2">
                    {empresa.imagen_url ? (
                      <Image
                        src={empresa.imagen_url}
                        alt={empresa.nombre}
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
                  <td className="px-4 py-2 font-semibold">{empresa.nombre}</td>
                  <td className="px-4 py-2">{empresa.descripcion || "-"}</td>
                  <td className="px-4 py-2">{empresa.telefono || "-"}</td>
                  <td className="px-4 py-2">{empresa.direccion || "-"}</td>
                  <td className="px-4 py-2 text-xs">{empresa.slug}</td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <Link
                      href={`/admin/empresas-transporte/${empresa.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(empresa.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === empresa.id}
                    >
                      {deletingId === empresa.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {empresas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No hay empresas registradas.
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
