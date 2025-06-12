"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Phone, Globe2, Landmark } from "lucide-react";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import Image from "next/image";

type Recreacion = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  slug: string;
  direccion?: string;
  telefono?: string;
  redes_sociales?: Record<string, string>;
};

export default function RecreacionPage() {
  const [establecimientos, setEstablecimientos] = useState<Recreacion[]>([]);
  const [selected, setSelected] = useState<Recreacion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("establecimientos_recreacion")
        .select("*");
      if (data) setEstablecimientos(data);
    };
    fetchData();
  }, []);

  return (
    <main className="bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-800 text-center mb-6 flex items-center justify-center gap-2"
        >
          <Landmark size={28} className="text-blue-700" />
          Espacios Recreativos en Frías
        </motion.h1>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12 text-sm sm:text-base">
          Encuentra lugares de recreación, esparcimiento y actividades al aire
          libre para todas las edades. Desde plazas hasta clubes, Frías te
          ofrece opciones para disfrutar y compartir en comunidad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {establecimientos.map((item, i) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              viewport={{ once: true }}
              className="cursor-pointer group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              onClick={() => setSelected(item)}
            >
              <div className="h-60 bg-gray-100 flex justify-center items-center overflow-hidden">
                <Image
                  src={item.imagen_url || "/images/placeholder.jpg"}
                  alt={item.nombre}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.descripcion || "Sin descripción disponible."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {selected && (
          <Modal
            isOpen={!!selected}
            onClose={() => setSelected(null)}
            imageUrl={selected.imagen_url}
            imageAlt={selected.nombre}
            telefono={selected.telefono || undefined}
          >
            <h2 className="text-2xl font-bold text-blue-800">
              {selected.nombre}
            </h2>

            <p className="text-sm text-gray-700">
              {selected.descripcion || "Sin descripción disponible."}
            </p>

            {selected.direccion && (
              <p className="flex items-center text-sm text-gray-600 mt-3">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                {selected.direccion}
              </p>
            )}

            {selected.telefono && (
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <Phone className="mr-2 h-4 w-4 text-green-500" />
                {selected.telefono}
              </p>
            )}

            {selected.redes_sociales && (
              <div className="space-y-1 mt-4 text-sm">
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
          </Modal>
        )}
      </div>
    </main>
  );
}
