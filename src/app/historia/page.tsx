"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const eventos = [
  { year: 1825, text: "Fundación del distrito por Simón Bolívar." },
  { year: 1857, text: "Ratificación por el gobierno de Ramón Castilla." },
  { year: 1950, text: "Desarrollo de vías y caminos rurales." },
  { year: 1975, text: "Expansión de servicios básicos a zonas rurales." },
  { year: 2000, text: "Modernización municipal y apertura educativa." },
  { year: 2025, text: "Celebración del Bicentenario del distrito." },
];

const fotos = [
  { src: "friasplaza.jpg", alt: "Plaza principal de Frías" },
  { src: "secundariaantigua.jpg", alt: "Antiguo colegio secundario" },
  { src: "primaria_antigua.jpg", alt: "Escuela primaria de antaño" },
  { src: "plazaantigua.jpg", alt: "Vista de la plaza en el siglo XX" },
];

export default function HistoriaPage() {
  const [selected, setSelected] = useState<null | (typeof fotos)[0]>(null);

  return (
    <main className="bg-white text-gray-800">
      {/* HERO */}
      <section className="relative h-[40vh] bg-[url('/images/portadafrias.png')] bg-cover bg-center flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/60 z-0" />
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold mb-2">Historia de Frías</h1>
          <p className="text-blue-100 max-w-lg mx-auto text-base sm:text-lg">
            Conoce la evolución de uno de los distritos más históricos de Piura.
          </p>
        </motion.div>
      </section>

      {/* FUNDACIÓN */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-blue-800">
            📜 Fundación del Distrito
          </h2>
          <p className="text-lg text-justify text-gray-700 leading-relaxed">
            El distrito de <strong>Frías</strong> fue creado el{" "}
            <strong>21 de junio de 1825</strong> mediante decreto del Libertador{" "}
            <strong>Simón Bolívar</strong>, ratificado por{" "}
            <strong>Ramón Castilla</strong> en 1857. Su nombre proviene del
            “Conde de Frías” o del vocablo <em>friá</em>, una planta medicinal
            local.
          </p>
        </motion.div>
      </section>

      {/* LÍNEA DE TIEMPO */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-blue-800 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🕰️ Línea de Tiempo Histórica
          </motion.h2>
          <ol className="relative border-l border-blue-200 space-y-12 pl-6 sm:pl-12">
            {eventos.map((e, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -left-[18px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md" />
                <time className="block mb-1 text-sm font-semibold text-blue-700">
                  {e.year}
                </time>
                <p className="text-sm sm:text-base text-gray-700">{e.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* GALERÍA CON MODAL */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-blue-800 text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            📸 Recuerdos de Antaño
          </motion.h2>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
            Un vistazo al pasado visual de Frías: su gente, calles y memoria
            viva.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {fotos.map((foto, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="overflow-hidden rounded-lg shadow-md aspect-[4/3] cursor-pointer"
                onClick={() => setSelected(foto)}
              >
                <Image
                  src={`/images/${foto.src}`}
                  alt={foto.alt}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full shadow-lg"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={`/images/${selected.src}`}
                  alt={selected.alt}
                  width={1000}
                  height={800}
                  className="w-full max-h-[80vh] object-contain"
                  style={{ width: "100%", height: "auto" }}
                />

                <div className="p-4 text-center text-gray-700 text-sm">
                  {selected.alt}
                </div>
                <button
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100"
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ALCALDES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-blue-800 text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🏛️ Alcaldes Históricos
          </motion.h2>
          <div className="overflow-x-auto border border-blue-100 rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 text-left">Periodo</th>
                  <th className="px-4 py-2 text-left">Alcalde</th>
                  <th className="px-4 py-2 text-left">Partido</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {[
                  ["2023–2026", "Anselmo Lizardo", "Fuerza Regional"],
                  ["2019–2022", "Ricardo Córdova", "Fuerza Regional"],
                  ["2015–2018", "Magaly Elera", "APD"],
                  ["2011–2014", "Magaly Elera", "UPRP"],
                  ["2007–2010", "Magaly Elera", "Alt. Campesina"],
                  ["2003–2006", "Manuel Holguín", "Somos Perú"],
                ].map(([periodo, nombre, partido], i) => (
                  <tr key={i} className="border-t border-blue-50">
                    <td className="px-4 py-2">{periodo}</td>
                    <td className="px-4 py-2">{nombre}</td>
                    <td className="px-4 py-2">{partido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EVOLUCIÓN */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-yellow-50">
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-blue-800">
            🌾 Evolución Cultural y Social
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            Frías ha evolucionado de un territorio agrícola a una comunidad
            vibrante con fuerte identidad cultural, infraestructura y
            emprendimiento.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            Sus nuevas generaciones fomentan el turismo rural, educación
            descentralizada y preservación del patrimonio.
          </p>
        </motion.div>
      </section>

      {/* VIDEO */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold text-blue-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🎥 Frías: Historia Viva
          </motion.h2>
          <p className="text-gray-600 mb-6">
            Una mirada audiovisual al legado del distrito en sus 200 años de
            historia.
          </p>
          <div className="aspect-video rounded-lg overflow-hidden shadow-md border-4 border-blue-200">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/6-7ET5Fs2cM"
              title="Frías Bicentenario"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
