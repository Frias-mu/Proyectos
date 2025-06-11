"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe2, BedDouble } from "lucide-react";
import Modal from "@/components/Modal";

type Hotel = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  direccion?: string;
  telefono?: string;
  redes_sociales?: Record<string, string>;
};

export default function HotelesPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [selected, setSelected] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("hoteles").select("*");
      if (!error && data) setHoteles(data);
    };
    fetchData();
  }, []);

  return (
    <main className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-800 text-center mb-6 flex items-center justify-center gap-2"
        >
          <BedDouble size={28} className="text-blue-600" />
          Hoteles en Frías
        </motion.h1>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12 text-sm sm:text-base">
          Descubre la variedad de alojamientos disponibles en la ciudad de
          Frías. Encuentra la opción perfecta para tu visita, ya sea por
          trabajo, descanso o turismo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hoteles.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border shadow hover:shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelected(hotel)}
            >
              <div className="h-60 bg-gray-100 flex justify-center items-center overflow-hidden">
                <img
                  src={hotel.imagen_url || "/placeholder.jpg"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  alt={hotel.nombre}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {hotel.nombre}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {hotel.descripcion || "Sin descripción disponible."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal global mejorado */}
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

            <p className="text-sm text-gray-700 mb-4">
              {selected.descripcion || "Sin descripción disponible."}
            </p>

            {selected.direccion && (
              <p className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                {selected.direccion}
              </p>
            )}

            {selected.telefono && (
              <p className="flex items-center text-sm text-gray-600 mb-1">
                <Phone className="mr-2 h-4 w-4 text-green-500" />
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
