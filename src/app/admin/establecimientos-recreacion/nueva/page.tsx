"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

export default function NuevoEstablecimientoRecreacionPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    direccion: "",
    telefono: "",
    slug: "",
    imagen: null as File | null,
  });

  const [submitting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function generarSlug(texto: string): string {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      const updatedForm = { ...formData, [name]: value };

      if (name === "nombre") {
        updatedForm.slug = generarSlug(value);
      }

      setFormData(updatedForm);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.nombre || !formData.slug) {
        setError("Los campos 'nombre' y 'slug' son obligatorios.");
        return;
      }

      const { data: existente, error: slugError } = await supabase
        .from("establecimientos_recreacion")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();

      if (slugError) {
        console.error("Error al verificar slug:", slugError.message);
        throw slugError;
      }

      if (existente) {
        setError(
          "Ya existe un establecimiento con este slug. Usa uno diferente."
        );
        return;
      }

      let imagen_url: string | null = null;

      if (formData.imagen) {
        const fileExt = formData.imagen.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: storageError } = await supabase.storage
          .from("imagenes")
          .upload(`establecimientos_recreacion/${fileName}`, formData.imagen);

        if (storageError) {
          console.error("Error al subir imagen:", storageError.message);
          throw new Error("No se pudo subir la imagen.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`establecimientos_recreacion/${fileName}`);

        imagen_url = publicUrlData?.publicUrl || null;
      }

      const nuevoEstablecimiento = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        tipo: formData.tipo || null,
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        slug: formData.slug,
        imagen_url,
      };

      const { error: insertError } = await supabase
        .from("establecimientos_recreacion")
        .insert([nuevoEstablecimiento]);

      if (insertError) {
        console.error("Error al insertar datos:", insertError.message);
        throw insertError;
      }

      router.push("/admin/establecimientos-recreacion");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error inesperado:", err.message);
      } else {
        console.error("Error inesperado:", err);
      }

      setError(
        "Error al guardar el establecimiento. Revisa los campos e intenta nuevamente."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Nuevo Establecimiento de Recreación
      </h1>
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
          <label className="block mb-1 font-medium">
            Tipo (ej. parque, museo)
          </label>
          <input
            type="text"
            name="tipo"
            className="w-full border px-4 py-2 rounded"
            value={formData.tipo}
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
            href="/admin/establecimientos-recreacion"
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
