"use client";

import React from "react";
import { motion } from "framer-motion";

const imagenes = [
  "/images/frias_sanandres.jpg",
  "/images/señorcautivo.jpg",
  "/images/frias_señordelosmilagros.jpg",
  "/images/diablicos1.jpg",
];
export default function FiestasGallery() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-blue-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎊 Galería de Fiestas Tradicionales
        </motion.h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Disfruta de algunos momentos capturados durante las celebraciones más
          importantes del distrito.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagenes.map((src, i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-xl shadow hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <img
                src={src}
                alt={`Fiesta ${i + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
