"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NuevoArtistaPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    biografia: "",
    slug: "",
    instagram: "",
    facebook: "",
    video_url: "",
    imagen: null as File | null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    setSubmitting(true);
    setError(null);

    try {
      if (!formData.nombre || !formData.slug) {
        toast.error("Los campos 'nombre' y 'slug' son obligatorios.");
        return;
      }

      let imagen_url: string | null = null;

      if (formData.imagen) {
        const ext = formData.imagen.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(`artistas/${fileName}`, formData.imagen);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`artistas/${fileName}`);

        imagen_url = urlData?.publicUrl;
      }

      const redes_sociales: Record<string, string> = {};
      if (formData.instagram) redes_sociales.instagram = formData.instagram;
      if (formData.facebook) redes_sociales.facebook = formData.facebook;

      const { error: insertError } = await supabase.from("artistas").insert([
        {
          nombre: formData.nombre,
          biografia: formData.biografia || null,
          slug: formData.slug,
          imagen_url,
          video_url: formData.video_url || null,
          redes_sociales: Object.keys(redes_sociales).length
            ? redes_sociales
            : null,
        },
      ]);

      if (insertError) throw insertError;

      toast.success("Artista creado correctamente.");
      router.push("/admin/artistas");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al insertar artista:", err.message);
      } else {
        console.error("Error al insertar artista:", err);
      }
      setError("No se pudo guardar el artista.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo Artista</h1>
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
          <label className="block mb-1 font-medium">Biografía</label>
          <textarea
            name="biografia"
            rows={3}
            className="w-full border px-4 py-2 rounded"
            value={formData.biografia}
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
          <label className="block mb-1 font-medium">Video de referencia</label>
          <input
            type="url"
            name="video_url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border px-4 py-2 rounded"
            value={formData.video_url}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Instagram</label>
            <input
              type="url"
              name="instagram"
              placeholder="https://instagram.com/usuario"
              className="w-full border px-4 py-2 rounded"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Facebook</label>
            <input
              type="url"
              name="facebook"
              placeholder="https://facebook.com/usuario"
              className="w-full border px-4 py-2 rounded"
              value={formData.facebook}
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
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex justify-between items-center">
          <Link
            href="/admin/artistas"
            className="text-gray-600 hover:underline text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
