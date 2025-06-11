"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Image from "next/image";

export default function NuevaEstatuaPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    ubicacion: "",
    slug: "",
    latitud: "",
    longitud: "",
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

      // Verifica si el slug ya existe
      const { data: existente, error: slugError } = await supabase
        .from("estatuas")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();

      if (slugError) {
        console.error("Error al verificar slug:", slugError.message);
        throw slugError;
      }

      if (existente) {
        setError("Ya existe una estatua con este slug. Usa uno diferente.");
        return;
      }

      let imagen_url: string | null = null;

      if (formData.imagen) {
        const fileExt = formData.imagen.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: storageError } = await supabase.storage
          .from("imagenes")
          .upload(`estatuas/${fileName}`, formData.imagen);

        if (storageError) {
          console.error("Error al subir imagen:", storageError.message);
          throw new Error("No se pudo subir la imagen.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`estatuas/${fileName}`);

        imagen_url = publicUrlData?.publicUrl || null;
      }

      const nuevaEstatua = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        fecha: formData.fecha || null,
        ubicacion: formData.ubicacion || null,
        slug: formData.slug,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        imagen_url,
      };

      const { error: insertError } = await supabase
        .from("estatuas")
        .insert([nuevaEstatua]);

      if (insertError) {
        console.error("Error al insertar datos:", insertError.message);
        throw insertError;
      }

      router.push("/admin/estatuas");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error inesperado:", err.message);
      } else {
        console.error("Error inesperado:", err);
      }

      setError(
        "Error al guardar la estatua. Revisa los campos e intenta nuevamente."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Estatua</h1>
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <Link
            href="/admin/estatuas"
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

      {formData.slug && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">
            Vista previa del Código QR
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Este código QR abrirá la URL:
            <br />
            <span className="font-mono text-blue-700">
              /estatuas/{formData.slug}
            </span>
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
