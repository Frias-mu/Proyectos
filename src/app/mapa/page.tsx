"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Sun,
  Navigation2,
  Mountain,
  Landmark,
  Users,
  X,
} from "lucide-react";

type InfoItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
};

export default function UbicacionPage() {
  const [selected, setSelected] = useState<InfoItem | null>(null);

  const datos: InfoItem[] = [
    {
      icon: <Landmark className="w-6 h-6 text-sky-600" />,
      label: "Región",
      value: "Piura",
      description:
        "Frías pertenece a la región Piura, ubicada en el noroeste del Perú.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-sky-600" />,
      label: "Provincia",
      value: "Ayabaca",
      description:
        "Ayabaca es una provincia andina reconocida por su cultura viva.",
    },
    {
      icon: <Mountain className="w-6 h-6 text-sky-600" />,
      label: "Altitud",
      value: "1,538 m.s.n.m.",
      description:
        "Ubicada en zona montañosa, ideal para turismo rural y paisajes verdes.",
    },
    {
      icon: <Sun className="w-6 h-6 text-sky-600" />,
      label: "Clima",
      value: "Templado",
      description:
        "Suave todo el año, con lluvias en verano entre diciembre y abril.",
    },
    {
      icon: <Navigation2 className="w-6 h-6 text-sky-600" />,
      label: "Extensión",
      value: "589.4 km²",
      description:
        "Amplio territorio rural con biodiversidad y zonas de cultivo.",
    },
    {
      icon: <Users className="w-6 h-6 text-sky-600" />,
      label: "Población",
      value: "25,000+",
      description:
        "Comunidad cálida, con fuerte identidad local e historia bicentenaria.",
    },
  ];

  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative h-[45vh] bg-[url('/images/bella1-1.jpg')] bg-cover bg-center text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold drop-shadow">
            ¿Dónde se encuentra Frías?
          </h1>
          <p className="mt-2 text-blue-100 text-lg">
            Una joya natural en el corazón de los Andes Piuranos.
          </p>
        </motion.div>
      </section>

      {/* Información general */}
      <section className="py-14 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-sky-800 text-center mb-10">
            📍 Información del Territorio
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {datos.map((item, i) => (
              <motion.button
                key={i}
                onClick={() => setSelected(item)}
                className="bg-white p-4 rounded-xl shadow border text-center hover:shadow-md transition-all w-full"
                whileHover={{ scale: 1.03 }}
              >
                <div className="mb-2">{item.icon}</div>
                <div className="text-sm font-semibold text-sky-800">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600">{item.value}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                {selected.icon}
                <h3 className="text-lg font-semibold text-sky-800">
                  {selected.label}
                </h3>
              </div>
              <p className="text-sm text-gray-700">{selected.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mapa */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-sky-800 mb-4">
            🗺️ Ubicación de Frías
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Explora el mapa y conoce cómo llegar a esta joya de la sierra
            piurana.
          </p>
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-sky-200">
            <iframe
              title="Mapa de Frías"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6905.718436579675!2d-79.95003106859183!3d-4.930386037660259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2spe!4v1744222384531!5m2!1ses!2spe"
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <section className="py-16 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold text-sky-800 mb-3">
              ☀️ Condiciones Climáticas
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Frías disfruta de un clima templado a lo largo del año. Las
              lluvias se presentan principalmente entre diciembre y abril,
              generando un entorno verde ideal para el ecoturismo y caminatas.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-sky-800 mb-3">
              🚗 Accesibilidad
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Puedes llegar desde Piura por la ruta Chulucanas - Frías. Es
              recomendable usar un vehículo apropiado para caminos rurales,
              especialmente durante los meses de lluvias.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
