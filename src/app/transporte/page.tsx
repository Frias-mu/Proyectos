"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import { BusFront, MapPin, Phone, Globe2 } from "lucide-react";

type Transporte = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  direccion?: string;
  telefono?: string;
  redes_sociales?: Record<string, string>;
};

export default function TransportePage() {
  const [empresas, setEmpresas] = useState<Transporte[]>([]);
  const [selected, setSelected] = useState<Transporte | null>(null);

  useEffect(() => {
    const fetchTransportes = async () => {
      const { data, error } = await supabase
        .from("empresas_transporte")
        .select("*");
      if (!error && data) setEmpresas(data);
    };
    fetchTransportes();
  }, []);

  return (
    <main className="bg-white py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-amber-700 text-center mb-10 flex items-center justify-center gap-2"
        >
          <BusFront className="text-amber-600" size={28} />
          Transporte Local
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((item, i) => (
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
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={item.imagen_url || "/images/placeholder.jpg"}
                  alt={item.nombre}
                  className="w-full h-full object-cover transition duration-300"
                  onError={(e) =>
                    (e.currentTarget.src = "/images/placeholder.jpg")
                  }
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

        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          imageUrl={selected?.imagen_url || "/images/placeholder.jpg"}
          imageAlt={selected?.nombre}
          telefono={selected?.telefono}
        >
          {selected && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selected.nombre}</h2>
              <p className="text-sm text-gray-700">
                {selected.descripcion || "Sin descripción."}
              </p>

              {selected.direccion && (
                <p className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4 text-amber-500" />
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
                        className="text-amber-600 hover:underline"
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
      </div>
    </main>
  );
}
