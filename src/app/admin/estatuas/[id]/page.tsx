"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Image from "next/image";

export default function EditarEstatuaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    ubicacion: "",
    slug: "",
    latitud: "",
    longitud: "",
    imagen: null as File | null,
    imagen_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEstatua = async () => {
      const { data, error } = await supabase
        .from("estatuas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("No se pudo cargar la estatua.");
        setLoading(false);
        return;
      }

      setFormData({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        fecha: data.fecha || "",
        ubicacion: data.ubicacion || "",
        slug: data.slug || "",
        latitud: data.latitud?.toString() || "",
        longitud: data.longitud?.toString() || "",
        imagen: null,
        imagen_url: data.imagen_url || "",
      });

      setLoading(false);
    };

    fetchEstatua();
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
        .from("estatuas")
        .select("id")
        .eq("slug", formData.slug)
        .not("id", "eq", id)
        .maybeSingle();

      if (slugError) throw slugError;

      if (existente) {
        setError("Ya existe una estatua con este slug.");
        setSubmitting(false);
        return;
      }

      let imagen_url = formData.imagen_url;

      if (formData.imagen) {
        const ext = formData.imagen.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const path = `estatuas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(path, formData.imagen);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("imagenes").getPublicUrl(path);
        imagen_url = data?.publicUrl || "";
      }

      const { error: updateError } = await supabase
        .from("estatuas")
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          fecha: formData.fecha || null,
          ubicacion: formData.ubicacion,
          slug: formData.slug,
          latitud: formData.latitud ? parseFloat(formData.latitud) : null,
          longitud: formData.longitud ? parseFloat(formData.longitud) : null,
          imagen_url,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/estatuas");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error inesperado:", err.message);
      } else {
        console.error("Error inesperado:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Estatua</h1>
        <Link
          href="/admin/estatuas"
          className="text-blue-600 text-sm hover:underline"
        >
          ← Volver a estatuas
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="w-full border px-4 py-2 rounded"
              value={formData.fecha}
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
        </div>

        <div>
          <label className="block mb-1 font-medium">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            className="w-full border px-4 py-2 rounded"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Latitud</label>
            <input
              type="number"
              name="latitud"
              step="any"
              className="w-full border px-4 py-2 rounded"
              value={formData.latitud}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitud</label>
            <input
              type="number"
              name="longitud"
              step="any"
              className="w-full border px-4 py-2 rounded"
              value={formData.longitud}
              onChange={handleChange}
            />
          </div>
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
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Imagen actual:
                <a
                  href={formData.imagen_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-1"
                >
                  Ver
                </a>
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      {formData.slug && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Código QR</h2>
          <p className="text-sm text-gray-600 mb-4">
            Este código QR dirige a:
            <br />
            <code className="text-blue-700 font-mono">
              /estatuas/{formData.slug}
            </code>
          </p>

          <div className="flex flex-col items-center gap-4">
            <Image
              src={`/api/qr/${formData.slug}`}
              alt={`QR para ${formData.slug}`}
              width={300}
              height={300}
              className="rounded shadow"
            />

            <a
              href={`/api/qr/${formData.slug}`}
              download={`${formData.slug}-qr.png`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Descargar QR
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
