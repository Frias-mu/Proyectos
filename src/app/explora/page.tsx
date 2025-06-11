"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import {
  BedDouble,
  Utensils,
  Palette,
  MapPin,
  Phone,
  Globe2,
  BusFront,
  Landmark,
} from "lucide-react";

type Tipo = "hotel" | "restaurante" | "artista" | "transporte" | "recreacion";

type Item = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  slug: string;
  direccion?: string;
  telefono?: string;
  tipo?: string;
  redes_sociales?: Record<string, string>;
  categoria: Tipo;
};

export default function ExploraPage() {
  const [items, setItems] = useState<Record<Tipo, Item[]>>({
    hotel: [],
    restaurante: [],
    artista: [],
    transporte: [],
    recreacion: [],
  });
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [hoteles, restaurantes, artistas, transporte, recreacion] =
        await Promise.all([
          supabase.from("hoteles").select("*"),
          supabase.from("restaurantes").select("*"),
          supabase.from("artistas").select("*"),
          supabase.from("empresas_transporte").select("*"),
          supabase.from("establecimientos_recreacion").select("*"),
        ]);

      setItems({
        hotel: (hoteles.data || []).map((h) => ({ ...h, categoria: "hotel" })),
        restaurante: (restaurantes.data || []).map((r) => ({
          ...r,
          categoria: "restaurante",
        })),
        artista: (artistas.data || []).map((a) => ({
          ...a,
          descripcion: a.biografia,
          categoria: "artista",
        })),
        transporte: (transporte.data || []).map((t) => ({
          ...t,
          categoria: "transporte",
        })),
        recreacion: (recreacion.data || []).map((r) => ({
          ...r,
          categoria: "recreacion",
        })),
      });
    };

    fetchAll();
  }, []);

  const iconByCategoria: Record<Tipo, React.ReactNode> = {
    hotel: <BedDouble className="text-blue-600" size={18} />,
    restaurante: <Utensils className="text-green-600" size={18} />,
    artista: <Palette className="text-purple-600" size={18} />,
    transporte: <BusFront className="text-amber-600" size={18} />,
    recreacion: <Landmark className="text-pink-600" size={18} />,
  };

  const titleByCategoria: Record<Tipo, string> = {
    hotel: "Hoteles",
    restaurante: "Restaurantes",
    artista: "Artistas",
    transporte: "Transportes",
    recreacion: "Recreación",
  };

  return (
    <main className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-800">
        Explora por Categoría
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {Object.entries(items).map(([tipo, lista]) => (
          <div key={tipo} className="space-y-4">
            <h2 className="text-lg font-bold text-center flex items-center justify-center gap-2 text-gray-700">
              {iconByCategoria[tipo as Tipo]}
              {titleByCategoria[tipo as Tipo]}
            </h2>

            {lista.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                viewport={{ once: true }}
              >
                <div
                  onClick={() => setSelected(item)}
                  className="cursor-pointer group bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.imagen_url || "/placeholder.jpg"}
                      alt={item.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.nombre}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {item.descripcion || "-"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <img
              src={selected.imagen_url}
              alt={selected.nombre}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-2xl font-bold">{selected.nombre}</h2>
            <p className="text-sm text-gray-700">
              {selected.descripcion || "Sin descripción."}
            </p>

            {selected.direccion && (
              <p className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                {selected.direccion}
              </p>
            )}

            {selected.telefono && (
              <p className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 h-4 w-4 text-green-500" />
                {selected.telefono}
              </p>
            )}

            {selected.redes_sociales && (
              <div className="space-y-1 text-sm">
                {Object.entries(selected.redes_sociales).map(([key, url]) => (
                  <p key={key} className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-gray-500" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {key}
                    </a>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
}
