"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function EditarLugarTuristicoPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

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
    imagen_principal_url: "",
    imagen_principal: null as File | null,
    galeriaUrls: [] as string[],
    galeriaFiles: [] as File[],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("No se pudo cargar el lugar.");
        setLoading(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        nombre: data.nombre,
        descripcion: data.descripcion || "",
        descripcion_detallada: data.descripcion_detallada || "",
        slug: data.slug,
        video_url: data.video_url || "",
        categoria: data.categoria || "",
        horario: data.horario || "",
        abierto_24h: data.abierto_24h ?? false,
        tags: (data.tags || []).join(", "),
        servicios: (data.servicios || []).join(", "),
        imagen_principal_url: data.imagen_principal || "",
        galeriaUrls: data.galeria || [],
      }));

      setLoading(false);
    }

    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (files && name === "galeria") {
      const incoming = Array.from(files);
      const totalAllowed = 5 - formData.galeriaUrls.length;
      const combined = incoming.slice(0, totalAllowed);
      setFormData((prev) => ({
        ...prev,
        galeriaFiles: combined,
      }));
    } else if (files && name === "imagen_principal") {
      setFormData((prev) => ({ ...prev, imagen_principal: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, abierto_24h: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeExistingImage = async (url: string) => {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    try {
      const path = decodeURIComponent(new URL(url).pathname.split("/").pop()!);
      await supabase.storage
        .from("imagenes")
        .remove([`lugares-turisticos/galeria/${path}`]);

      const galeriaUrls = formData.galeriaUrls.filter((u) => u !== url);
      await supabase
        .from("lugares_turisticos")
        .update({ galeria: galeriaUrls })
        .eq("id", id);

      setFormData((prev) => ({ ...prev, galeriaUrls }));
    } catch {
      toast.error("Error eliminando la imagen.");
    }
  };

  const removeNewImage = (index: number) => {
    setFormData((prev) => {
      const galeriaFiles = [...prev.galeriaFiles];
      galeriaFiles.splice(index, 1);
      return { ...prev, galeriaFiles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!formData.nombre || !formData.slug) {
        toast.error("Los campos 'nombre' y 'slug' son obligatorios.");
        setSubmitting(false);
        return;
      }

      let imagen_principal_url = formData.imagen_principal_url;

      if (formData.imagen_principal) {
        const ext = formData.imagen_principal.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const path = `lugares-turisticos/imagen_principal/${fileName}`;
        const { error } = await supabase.storage
          .from("imagenes")
          .upload(path, formData.imagen_principal);
        if (error) throw error;
        const { data } = supabase.storage.from("imagenes").getPublicUrl(path);
        imagen_principal_url = data.publicUrl;
      }

      const newUrls: string[] = [];
      for (const file of formData.galeriaFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const path = `lugares-turisticos/galeria/${fileName}`;
        const { error } = await supabase.storage
          .from("imagenes")
          .upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("imagenes").getPublicUrl(path);
        if (data.publicUrl) newUrls.push(data.publicUrl);
      }

      const galeria = [...formData.galeriaUrls, ...newUrls].slice(0, 5);

      const { error: updateError } = await supabase
        .from("lugares_turisticos")
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          descripcion_detallada: formData.descripcion_detallada || null,
          slug: formData.slug,
          video_url: formData.video_url || null,
          categoria: formData.categoria || null,
          horario: formData.horario || null,
          abierto_24h: formData.abierto_24h,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : null,
          servicios: formData.servicios
            ? formData.servicios.split(",").map((s) => s.trim())
            : null,
          imagen_principal: imagen_principal_url,
          galeria,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Lugar actualizado.");
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

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Editar Lugar Turístico
      </h1>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
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

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="abierto_24h"
            checked={formData.abierto_24h}
            onChange={handleChange}
          />
          Abierto 24 h
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

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Imagen principal
          </label>
          <input
            type="file"
            name="imagen_principal"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {formData.imagen_principal_url && (
            <Image
              src={formData.imagen_principal_url}
              alt="Actual"
              width={120}
              height={80}
              className="mt-3 rounded border border-gray-200 shadow-sm"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Galería (máx. 5 imágenes)
          </label>
          <input
            type="file"
            name="galeria"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full"
            disabled={
              formData.galeriaUrls.length + formData.galeriaFiles.length >= 5
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Puedes subir{" "}
            {5 - (formData.galeriaUrls.length + formData.galeriaFiles.length)}{" "}
            imágenes más
          </p>

          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.galeriaUrls.map((url, i) => (
              <li key={`old-${i}`} className="relative">
                <Image
                  src={url}
                  alt=""
                  width={120}
                  height={80}
                  className="rounded border object-cover w-full"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition"
                >
                  ✕
                </button>
              </li>
            ))}
            {formData.galeriaFiles.map((file, i) => {
              const preview = URL.createObjectURL(file);
              return (
                <li key={`new-${i}`} className="relative">
                  <Image
                    src={preview}
                    alt=""
                    width={120}
                    height={80}
                    className="rounded border object-cover w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-4">
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
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

// COMPONENTES DE FORMULARIO
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 bg-white shadow-sm focus:outline-blue-500"
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
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 bg-white shadow-sm focus:outline-blue-500"
      />
    </div>
  );
}
