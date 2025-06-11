"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

export default function NuevaLugarPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    slug: "",
    video_url: "",
    imagen: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const genSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) setForm((f) => ({ ...f, imagen: files[0] }));
    else {
      setForm((f) => ({
        ...f,
        [name]: value,
        ...(name === "nombre" ? { slug: genSlug(value) } : {}),
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!form.nombre || !form.slug) {
      setError("Nombre y slug son obligatorios.");
      setSubmitting(false);
      return;
    }

    const { data: exists } = await supabase
      .from("lugares_turisticos")
      .select("id")
      .eq("slug", form.slug)
      .maybeSingle();

    if (exists) {
      setError("El slug ya existe.");
      setSubmitting(false);
      return;
    }

    let imgUrl: string | null = null;
    if (form.imagen) {
      const ext = form.imagen.name.split(".").pop();
      const filename = `${uuidv4()}.${ext}`;
      const { error: errUp } = await supabase.storage
        .from("imagenes")
        .upload(`lugares/${filename}`, form.imagen);
      if (errUp) {
        console.error(errUp);
        setError("Error subiendo imagen.");
        setSubmitting(false);
        return;
      }
      const { data } = supabase.storage
        .from("imagenes")
        .getPublicUrl(`lugares/${filename}`);
      imgUrl = data.publicUrl;
    }

    const { error: errIns } = await supabase.from("lugares_turisticos").insert([
      {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        slug: form.slug,
        imagen_url: imgUrl,
        video_url: form.video_url || null,
      },
    ]);

    if (errIns) {
      console.error(errIns);
      setError("Error guardando.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/lugares-turisticos");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuevo Lugar Turístico</h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Nombre */}
        <div>
          <label>Nombre *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Descripción */}
        <div>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        {/* Slug */}
        <div>
          <label>Slug *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Video URL */}
        <div>
          <label>Video URL</label>
          <input
            name="video_url"
            type="url"
            value={form.video_url}
            onChange={onChange}
            placeholder="https://..."
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Imagen */}
        <div>
          <label>Imagen</label>
          <input
            name="imagen"
            type="file"
            accept="image/*"
            onChange={onChange}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex justify-between">
          <Link href="/admin/lugares-turisticos" className="text-gray-600">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
