"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Palette, MapPin, Phone, Globe2, Video, X } from "lucide-react";

type Artista = {
  id: string;
  nombre: string;
  biografia?: string;
  imagen_url?: string;
  direccion?: string;
  telefono?: string;
  video_url?: string;
  redes_sociales?: Record<string, string>;
};

export default function ArtistasPage() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [selected, setSelected] = useState<Artista | null>(null);

  useEffect(() => {
    const fetchArtistas = async () => {
      const { data, error } = await supabase.from("artistas").select("*");
      if (!error && data) setArtistas(data);
    };

    fetchArtistas();
  }, []);

  return (
    <main className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-purple-700 text-center mb-6 flex items-center justify-center gap-2"
        >
          <Palette className="text-purple-600" size={28} />
          Artistas Locales
        </motion.h1>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12 text-sm sm:text-base">
          Nuestra ciudad es un semillero de creatividad. Aquí te presentamos a
          los artistas locales que con su talento enriquecen la cultura y el
          alma de nuestra comunidad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artistas.map((item, i) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border shadow hover:shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="h-60 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={item.imagen_url || "/placeholder.jpg"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  alt={item.nombre}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.nombre}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {item.biografia || "Sin biografía disponible."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal personalizado */}
        {selected ? (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSelected(null)}
                aria-label="Cerrar modal"
              >
                <X size={22} />
              </button>

              <div className="rounded-md overflow-hidden bg-gray-100 mb-4 flex justify-center items-center max-h-[300px]">
                <img
                  src={selected.imagen_url || "/placeholder.jpg"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  alt={selected.nombre}
                  className="max-h-[300px] w-auto h-auto object-contain"
                />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-purple-800">
                {selected.nombre}
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                {selected.biografia || "Sin biografía disponible."}
              </p>

              {selected.video_url && (
                <p className="text-sm text-blue-600 mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <a
                    href={selected.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Ver video de referencia
                  </a>
                </p>
              )}

              {selected.direccion && (
                <p className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="mr-2 h-4 w-4 text-purple-500" />
                  {selected.direccion}
                </p>
              )}

              {selected.telefono && (
                <p className="flex items-center text-sm text-gray-600 mb-1">
                  <Phone className="mr-2 h-4 w-4 text-purple-500" />
                  {selected.telefono}
                </p>
              )}

              {selected.redes_sociales && (
                <div className="space-y-1 mt-2 text-sm">
                  {Object.entries(selected.redes_sociales).map(([key, url]) => (
                    <p key={key} className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-gray-500" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {key}
                      </a>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
