"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";

type LugarTuristico = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_principal: string;
  slug: string;
  tags?: string[];
  servicios?: string[];
};

export default function LugaresTuristicosPage() {
  const [lugares, setLugares] = useState<LugarTuristico[]>([]);

  useEffect(() => {
    const fetchLugares = async () => {
      const { data, error } = await supabase
        .from("lugares_turisticos")
        .select(
          "id, nombre, descripcion, imagen_principal, slug, tags, servicios"
        )
        .order("nombre");

      if (error) {
        console.error("Error al cargar lugares turísticos:", error.message);
        return;
      }

      setLugares(data || []);
    };

    fetchLugares();
  }, []);

  return (
    <>
      <Head>
        <title>Lugares Turísticos en Frías</title>
        <meta
          name="description"
          content="Explora los lugares turísticos más fascinantes de Frías. Encuentra información, imágenes y detalles sobre cascadas, bosques, plazas y más."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <section className="h-screen bg-gradient-to-br from-blue-200 via-white to-green-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-center text-blue-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Descubre los Lugares Turísticos de Frías
          </motion.h1>

          <motion.p
            className="text-center text-gray-700 max-w-2xl mx-auto mb-12 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Sumérgete en la belleza natural y cultural de Frías. Desde sus
            paisajes encantadores hasta sus sitios históricos, aquí encontrarás
            todo lo que necesitas para planificar tu próxima aventura.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {lugares.map((lugar, i) => (
              <motion.div
                key={lugar.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/lugares-turisticos/${lugar.slug}`}
                  className="block bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300 overflow-hidden group"
                >
                  <div className="relative aspect-video">
                    {lugar.imagen_principal && (
                      <Image
                        src={lugar.imagen_principal}
                        alt={lugar.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">
                      {lugar.nombre}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {lugar.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(lugar.tags) &&
                        lugar.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}

                      {Array.isArray(lugar.servicios) &&
                        lugar.servicios.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {lugares.length === 0 && (
            <p className="text-center text-gray-500 mt-12">
              Cargando lugares turísticos...
            </p>
          )}
        </div>
      </section>
    </>
  );
}
