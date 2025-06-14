"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function NuevoLugarTuristicoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    descripcion_detallada: "",
    slug: "",
    video_url: "",
    categoria: "",
    horario: "",
    abierto_24h: false,
    tags: "",
    servicios: "",
    imagen_principal: null as File | null,
    galeria: [] as File[],
  });

  const [galeriaPreview, setGaleriaPreview] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (files) {
      if (name === "galeria") {
        const selected = Array.from(files).slice(0, 5);
        setFormData({ ...formData, galeria: selected });
        setGaleriaPreview(selected.map((f) => URL.createObjectURL(f)));
      } else {
        setFormData({ ...formData, imagen_principal: files[0] });
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      if (name === "nombre") {
        const generatedSlug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setFormData({ ...formData, nombre: value, slug: generatedSlug });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const removeGaleriaItem = (index: number) => {
    const newGaleria = [...formData.galeria];
    const newPreview = [...galeriaPreview];
    newGaleria.splice(index, 1);
    newPreview.splice(index, 1);
    setFormData({ ...formData, galeria: newGaleria });
    setGaleriaPreview(newPreview);
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

      let imagen_principal_url: string | null = null;
      if (formData.imagen_principal) {
        const ext = formData.imagen_principal.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(
            `lugares-turisticos/imagen_principal/${fileName}`,
            formData.imagen_principal
          );
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`lugares-turisticos/imagen_principal/${fileName}`);
        imagen_principal_url = urlData?.publicUrl;
      }

      const galeria_urls: string[] = [];
      for (const file of formData.galeria) {
        const ext = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const path = `lugares-turisticos/galeria/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("imagenes")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(path);
        if (urlData?.publicUrl) galeria_urls.push(urlData.publicUrl);
      }

      const { error: insertError } = await supabase
        .from("lugares_turisticos")
        .insert([
          {
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            descripcion_detallada: formData.descripcion_detallada || null,
            slug: formData.slug,
            video_url: formData.video_url || null,
            imagen_principal: imagen_principal_url,
            galeria: galeria_urls.length ? galeria_urls : null,
            categoria: formData.categoria || null,
            horario: formData.horario || null,
            abierto_24h: formData.abierto_24h,
            tags: formData.tags
              ? formData.tags.split(",").map((tag) => tag.trim())
              : null,
            servicios: formData.servicios
              ? formData.servicios.split(",").map((s) => s.trim())
              : null,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Lugar creado correctamente.");
      router.push("/admin/lugares-turisticos");
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 dark:text-white text-center">
        Nuevo Lugar Turístico
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre *"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <Input
            label="Slug *"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        <Textarea
          label="Descripción breve"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <Textarea
          label="Descripción detallada"
          name="descripcion_detallada"
          value={formData.descripcion_detallada}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          />
          <Input
            label="Horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="abierto_24h"
            checked={formData.abierto_24h}
            onChange={handleChange}
          />
          Abierto 24h
        </label>

        <Input
          label="Video URL"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
        />
        <Input
          label="Tags (separados por coma)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
        <Input
          label="Servicios (separados por coma)"
          name="servicios"
          value={formData.servicios}
          onChange={handleChange}
        />

        <FileInput
          label="Imagen principal"
          name="imagen_principal"
          onChange={handleChange}
        />
        <FileInput
          label="Galería (máx. 5 imágenes)"
          name="galeria"
          onChange={handleChange}
          multiple
        />

        {galeriaPreview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {galeriaPreview.map((src, index) => (
              <div key={index} className="relative group">
                <Image
                  src={src}
                  alt={`Preview ${index}`}
                  width={150}
                  height={100}
                  className="rounded-lg shadow object-cover w-full h-auto"
                />
                <button
                  type="button"
                  onClick={() => removeGaleriaItem(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="flex justify-between items-center mt-6">
          <Link
            href="/admin/lugares-turisticos"
            className="text-gray-600 hover:underline text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

// COMPONENTES REUTILIZABLES

function Input({
  label,
  name,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      />
    </div>
  );
}

function FileInput({
  label,
  name,
  multiple = false,
  onChange,
}: {
  label: string;
  name: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
