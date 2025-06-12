"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NuevoRestaurantePage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    slug: "",
    imagen: null as File | null,
  });

  const [submitting] = useTransition();
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
          .upload(`restaurantes/${fileName}`, formData.imagen);

        if (uploadError) {
          console.error("Error al subir imagen:", uploadError.message);
          throw new Error("No se pudo subir la imagen.");
        }

        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`restaurantes/${fileName}`);

        imagen_url = urlData?.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("restaurantes")
        .insert([
          {
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            direccion: formData.direccion || null,
            telefono: formData.telefono || null,
            slug: formData.slug,
            imagen_url,
          },
        ]);

      if (insertError) {
        console.error("Error al insertar restaurante:", insertError.message);
        throw insertError;
      }

      toast.success("Restaurante creado correctamente.");
      router.push("/admin/restaurantes");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error inesperado:", err.message);
      } else {
        console.error("Error inesperado:", err);
      }
      setError("Error al guardar el restaurante. Revisa los campos.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo Restaurante</h1>
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
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <Link
            href="/admin/restaurantes"
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
