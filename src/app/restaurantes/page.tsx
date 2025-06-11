"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe2, Utensils } from "lucide-react";

type Restaurante = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  direccion?: string;
  telefono?: string;
  redes_sociales?: Record<string, string>;
};

export default function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [selected, setSelected] = useState<Restaurante | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("restaurantes").select("*");
      if (!error && data) setRestaurantes(data);
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
          className="text-3xl font-bold text-green-700 text-center mb-6 flex items-center justify-center gap-2"
        >
          <Utensils size={28} className="text-green-600" />
          Lugares Gastronómicos
        </motion.h1>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12 text-sm sm:text-base">
          Explora los sabores de Frías. Descubre restaurantes, parrillas, bares
          y lugares típicos donde podrás disfrutar lo mejor de la gastronomía
          local.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((item, i) => (
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
              <div className="h-60 bg-gray-100 flex justify-center items-center overflow-hidden">
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
                  {item.descripcion || "Sin descripción disponible."}
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
            <h2 className="text-2xl font-bold text-green-800">
              {selected.nombre}
            </h2>

            <p className="text-sm text-gray-700">
              {selected.descripcion || "Sin descripción disponible."}
            </p>

            {selected.direccion && (
              <p className="flex items-center text-sm text-gray-600 mt-3">
                <MapPin className="mr-2 h-4 w-4 text-green-500" />
                {selected.direccion}
              </p>
            )}

            {selected.telefono && (
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <Phone className="mr-2 h-4 w-4 text-blue-500" />
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
                      className="text-green-600 hover:underline"
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
