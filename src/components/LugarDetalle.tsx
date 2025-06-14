"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface LugarTuristicoProps {
  nombre: string;
  descripcion: string;
  descripcion_detallada?: string;
  imagen_principal?: string;
  video_url?: string;
  galeria?: string[];
  categoria?: string;
  horario?: string;
  abierto_24h?: boolean;
  tags?: string[];
  servicios?: string[];
}

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w\-]{11})/
  );
  return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url;
}

export default function LugarDetalle(props: LugarTuristicoProps) {
  const embedUrl = props.video_url ? getEmbedUrl(props.video_url) : undefined;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-gray-100">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-8 text-center leading-tight tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {props.nombre}
      </motion.h1>

      {props.imagen_principal && (
        <div className="mb-10">
          <Image
            src={props.imagen_principal}
            alt={props.nombre}
            width={1200}
            height={600}
            className="w-full rounded-xl shadow-lg object-cover max-h-[480px]"
          />
        </div>
      )}

      <motion.p
        className="text-lg text-gray-700 leading-relaxed mb-6 text-justify"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {props.descripcion}
      </motion.p>

      {props.descripcion_detallada && (
        <motion.div
          className="text-base text-gray-800 whitespace-pre-line mb-10 leading-loose"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {props.descripcion_detallada}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 text-sm text-gray-700">
        {props.categoria && (
          <InfoCard label="Categoría" value={props.categoria} />
        )}
        {props.horario && <InfoCard label="Horario" value={props.horario} />}
        <InfoCard
          label="Abierto 24 h"
          value={props.abierto_24h ? "Sí" : "No"}
        />
        {props.tags?.length && (
          <InfoCard label="Tags" value={props.tags.join(", ")} />
        )}
        {props.servicios?.length && (
          <InfoCard label="Servicios" value={props.servicios.join(", ")} />
        )}
      </div>

      {Array.isArray(props.galeria) && props.galeria.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Galería</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {props.galeria.map((url, idx) => (
              <div
                key={idx}
                className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => {
                  setModalImage(url);
                  setModalOpen(true);
                }}
              >
                <Image
                  src={url}
                  alt={`${props.nombre} galería ${idx + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {embedUrl && (
        <section className="mb-4">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
            Video
          </h2>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <iframe
              src={embedUrl}
              title={`Video de ${props.nombre}`}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {/* Modal de imagen */}
      <AnimatePresence>
        {modalOpen && modalImage && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4 sm:mx-8 rounded-xl overflow-hidden shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 bg-white text-gray-700 rounded-full p-2 shadow hover:bg-gray-100 z-10"
                aria-label="Cerrar imagen ampliada"
              >
                ✕
              </button>
              <Image
                src={modalImage}
                alt="Vista ampliada"
                width={1200}
                height={800}
                className="w-full h-auto object-contain max-h-[90vh] bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <p className="text-xs font-semibold uppercase text-gray-500 mb-1 tracking-wide">
        {label}
      </p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
