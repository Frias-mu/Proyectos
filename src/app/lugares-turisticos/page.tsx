"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

type Lugar = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  slug: string;
};

export default function LugaresTuristicosPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);

  useEffect(() => {
    const fetchLugares = async () => {
      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select("id, nombre, descripcion, imagen_url, slug")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error al cargar lugares:", error.message);
        return;
      }

      setLugares(data || []);
    };

    fetchLugares();
  }, []);

  return (
    <main className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-blue-800 mb-12"
        >
          Lugares Turísticos del Distrito
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {lugares.map((lugar, i) => (
            <motion.div
              key={lugar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/lugares-turisticos/${lugar.slug}`}
                className="block bg-white shadow hover:shadow-lg rounded-xl overflow-hidden transition"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={lugar.imagen_url || "/placeholder.jpg"}
                    alt={`Imagen de ${lugar.nombre}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    {lugar.nombre}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {lugar.descripcion}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
