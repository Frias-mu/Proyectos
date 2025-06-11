"use client";

import React from "react";
import { motion } from "framer-motion";
import { festividades } from "@/components/FestividadesSection";
import FiestasGallery from "@/components/FiestasGallery";

export default function FiestasPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* HERO */}
      <section className="relative bg-[url('/images/portadafrias.png')] bg-cover bg-center py-24 px-6 text-white">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            🎉 Calendario Festivo de Frías
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            Vive la cultura, la fe y la alegría que unen a nuestro pueblo.
          </p>
        </motion.div>
      </section>

      {/* FESTIVIDADES */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            📅 Fechas que Marcan Nuestra Identidad
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {festividades.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:border-blue-700 transition-all"
              >
                <p className="text-sm font-medium text-blue-700">{f.fecha}</p>
                <h3 className="text-xl font-semibold text-blue-900 mt-2">
                  {f.nombre}
                </h3>
                <p className="text-sm text-gray-600 mt-3">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* GALERÍA */}

      <FiestasGallery />
    </main>
  );
}
