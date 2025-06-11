"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function EditarLugarPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    slug: "",
    video_url: "",
    imagen_url: "",
    imagen: null as File | null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        setError("Error cargando.");
      } else if (data) {
        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
          slug: data.slug,
          video_url: data.video_url || "",
          imagen_url: data.imagen_url || "",
          imagen: null,
        });
      }
      setLoading(false);
    })();
  }, [id]);

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
    if (files) {
      setForm((f) => ({ ...f, imagen: files[0] }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
        ...(name === "nombre" ? { slug: genSlug(value) } : {}),
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!form.nombre || !form.slug) {
      setError("Nombre y slug son obligatorios.");
      setSubmitting(false);
      return;
    }

    let imgUrl = form.imagen_url;
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

    const { error: errUpd } = await supabase
      .from("lugares_turisticos")
      .update({
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        slug: form.slug,
        imagen_url: imgUrl,
        video_url: form.video_url || null,
      })
      .eq("id", id);

    if (errUpd) {
      console.error(errUpd);
      setError("Error actualizando.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/lugares-turisticos");
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Lugar Turístico</h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="block mb-1 font-medium">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            className="w-full border px-4 py-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Slug *</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={onChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Video URL</label>
          <input
            type="url"
            name="video_url"
            value={form.video_url}
            onChange={onChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="w-full"
          />
          {form.imagen_url && (
            <Image
              src={form.imagen_url}
              alt="Vista previa"
              width={128}
              height={128}
              className="rounded mt-2 object-cover"
            />
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex justify-between items-center">
          <Link
            href="/admin/lugares-turisticos"
            className="text-gray-600 hover:underline text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
