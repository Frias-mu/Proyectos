"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import Image from "next/image";

const galeria: Record<string, string[]> = {
  Atardeceres: [
    "/images/atardecer1.jpg",
    "/images/atardecer2.jpg",
    "/images/atardecer3.jpg",
  ],
  Noches: ["/images/noche1.jpg", "/images/noche2.jpg", "/images/noche3.jpg"],
  Paisajes: [
    "/images/paisaje1.jpg",
    "/images/paisaje2.jpg",
    "/images/paisaje3.jpg",
  ],
  "Lugares Emblemáticos": [
    "/images/lugar1.jpg",
    "/images/lugar2.jpg",
    "/images/lugar3.jpg",
  ],
};

export default function GaleriaPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState<string | null>(null);
  const [indiceActual, setIndiceActual] = useState(0);

  const abrirModal = (categoria: string, index: number) => {
    setCategoriaActual(categoria);
    setIndiceActual(index);
    setModalOpen(true);
  };

  const cerrarModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const siguiente = useCallback(() => {
    if (!categoriaActual) return;
    const total = galeria[categoriaActual].length;
    setIndiceActual((prev) => (prev + 1) % total);
  }, [categoriaActual]);

  const anterior = useCallback(() => {
    if (!categoriaActual) return;
    const total = galeria[categoriaActual].length;
    setIndiceActual((prev) => (prev - 1 + total) % total);
  }, [categoriaActual]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === "Escape") cerrarModal();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, cerrarModal, siguiente, anterior]);

  return (
    <main className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-3">
            Galería de Frías
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Disfrutá imágenes destacadas de nuestra ciudad: paisajes,
            atardeceres y lugares únicos capturados por artistas locales y
            visitantes.
          </p>
        </motion.header>

        {Object.entries(galeria).map(([categoria, imagenes]) => (
          <section key={categoria} className="mb-20">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-blue-700 mb-8 flex items-center gap-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageIcon className="w-6 h-6 text-blue-400" />
              {categoria}
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
              {imagenes.map((src, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg overflow-hidden shadow hover:shadow-lg bg-white cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => abrirModal(categoria, i)}
                >
                  <Image
                    src={src}
                    alt={`${categoria} ${i + 1}`}
                    width={500}
                    height={300}
                    className="object-cover w-full h-48 sm:h-56 lg:h-64 transition-transform duration-300 hover:opacity-90"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && categoriaActual && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
            onClick={cerrarModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-6xl w-full max-h-[90vh] mx-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <Image
                src={galeria[categoriaActual][indiceActual]}
                alt={`${categoriaActual} ampliada`}
                width={1200}
                height={800}
                className="w-full max-h-[85vh] object-contain rounded-xl shadow-xl"
                style={{ width: "100%", height: "auto" }}
              />

              <button
                onClick={anterior}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={siguiente}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-red-100"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
