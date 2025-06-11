"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export default function EditarEmpresaTransportePage() {
  const { id } = useParams() as { id: string };

  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    slug: "",
    imagen: null as File | null,
    imagen_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("empresas_transporte")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("No se pudo cargar la empresa.");
        console.error(error);
        setLoading(false);
        return;
      }

      setFormData({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
        slug: data.slug || "",
        imagen: null,
        imagen_url: data.imagen_url || "",
      });

      setLoading(false);
    };

    fetchEmpresa();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.nombre || !formData.slug) {
        setError("Los campos 'nombre' y 'slug' son obligatorios.");
        setSubmitting(false);
        return;
      }

      const { data: existente, error: slugError } = await supabase
        .from("empresas_transporte")
        .select("id")
        .eq("slug", formData.slug)
        .not("id", "eq", id)
        .maybeSingle();

      if (slugError) throw slugError;

      if (existente) {
        setError("Ya existe una empresa con este slug. Usa uno diferente.");
        setSubmitting(false);
        return;
      }

      let imagen_url = formData.imagen_url;

      if (formData.imagen) {
        const fileExt = formData.imagen.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(`empresas_transporte/${fileName}`, formData.imagen);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`empresas_transporte/${fileName}`);
        imagen_url = urlData?.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("empresas_transporte")
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          direccion: formData.direccion,
          telefono: formData.telefono,
          slug: formData.slug,
          imagen_url,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/empresas-transporte");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al actualizar:", err.message);
      } else {
        console.error("Error al actualizar:", err);
      }
      setError("No se pudo actualizar la empresa.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa de Transporte</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Nombre *</label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full border px-4 py-2 rounded"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            className="w-full border px-4 py-2 rounded"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="w-full border px-4 py-2 rounded"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="w-full border px-4 py-2 rounded"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Slug *</label>
          <input
            type="text"
            name="slug"
            required
            className="w-full border px-4 py-2 rounded"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Imagen</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            className="w-full"
            onChange={handleChange}
          />
          {formData.imagen_url && (
            <p className="text-sm text-gray-600 mt-2">
              Imagen actual:{" "}
              <a
                href={formData.imagen_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver imagen
              </a>
            </p>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <Link
            href="/admin/empresas-transporte"
            className="text-gray-600 hover:underline text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
