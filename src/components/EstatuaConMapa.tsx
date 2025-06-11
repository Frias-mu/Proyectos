"use client";

import MapaDireccion from "./MapaDireccion";
import { motion } from "framer-motion";

type Props = {
  nombre: string;
  imagen_url?: string;
  descripcion?: string;
  fecha?: string;
  ubicacion?: string;
  latitud?: number;
  longitud?: number;
};

export default function EstatuaConMapa({
  nombre,
  imagen_url,
  descripcion,
  fecha,
  ubicacion,
  latitud,
  longitud,
}: Props) {
  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 px-4 py-10 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Título */}
      <h1 className="text-3xl font-extrabold text-blue-800 text-center">
        {nombre}
      </h1>

      {/* Imagen */}
      {imagen_url && (
        <div className="overflow-hidden rounded-xl shadow-md">
          <img
            src={imagen_url}
            alt={nombre}
            className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Descripción */}
      {descripcion && (
        <p className="text-gray-700 text-justify leading-relaxed whitespace-pre-line">
          {descripcion}
        </p>
      )}

      {/* Fecha */}
      {fecha && (
        <p className="text-sm text-gray-500">
          🗓️ Inauguración:{" "}
          <strong>{new Date(fecha).toLocaleDateString("es-PE")}</strong>
        </p>
      )}

      {/* Representación */}
      {ubicacion && (
        <p className="text-sm text-gray-600">
          📍 Representa: <strong>{ubicacion}</strong>
        </p>
      )}

      {/* Mapa */}
      {latitud && longitud ? (
        <div className="rounded-xl overflow-hidden shadow-md border border-blue-200">
          <MapaDireccion destinoLat={latitud} destinoLng={longitud} />
        </div>
      ) : (
        <div className="text-sm text-yellow-600 font-medium">
          ⚠️ Ubicación geográfica no disponible.
        </div>
      )}
    </motion.div>
  );
}
