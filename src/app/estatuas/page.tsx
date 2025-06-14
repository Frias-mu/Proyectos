"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Estatua = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  slug: string;
};

export default function EstatuasPage() {
  const [estatuas, setEstatuas] = useState<Estatua[]>([]);

  useEffect(() => {
    const fetchEstatuas = async () => {
      const { data, error } = await supabase
        .from("estatuas")
        .select("id, nombre, descripcion, imagen_url, slug")
        .order("nombre");

      if (error) {
        console.error("Error fetching estatuas:", error.message);
        return;
      }

      setEstatuas(data || []);
    };

    fetchEstatuas();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 via-zinc-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-blue-800 text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Estatuas Históricas de Frías
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {estatuas.map((estatua, i) => (
            <motion.div
              key={estatua.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/estatuas/${estatua.slug}`}
                className="block bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-video">
                  {estatua.imagen_url && (
                    <Image
                      src={estatua.imagen_url}
                      alt={estatua.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-blue-900 mb-1">
                    {estatua.nombre}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {estatua.descripcion}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {estatuas.length === 0 && (
          <p className="text-center text-gray-500 mt-12">
            Cargando estatuas...
          </p>
        )}
      </div>
    </section>
  );
}
