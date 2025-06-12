"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function ContactoPage() {
  const [enviado] = useState(false);

  return (
    <main className="text-gray-800">
      {/* HERO */}
      <section className="relative bg-[url('/images/portada2.jpg')] bg-cover bg-center py-24 px-6 text-white">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-lg md:text-xl text-gray-100">
            ¿Tienes dudas, propuestas o deseas participar en el Bicentenario?
            ¡Escríbenos!
          </p>
        </motion.div>
      </section>

      {/* FORMULARIO Y CONTACTO */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* FORMULARIO */}
          <motion.div
            className="space-y-6 bg-blue-50 p-8 rounded-xl shadow text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Escríbenos
            </h2>
            <p className="text-gray-700 mb-4">
              Envía tu mensaje de forma rápida desde Facilita.gob.pe
            </p>
            <a
              href="https://facilita.gob.pe/t/4261"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded shadow font-medium transition"
            >
              Ir al Formulario
            </a>
            {enviado && (
              <p className="text-green-600 text-sm font-semibold">
                ¡Gracias! Tu mensaje fue enviado.
              </p>
            )}
          </motion.div>

          {/* INFORMACIÓN INSTITUCIONAL */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-blue-800">
              Municipalidad de Frías
            </h2>
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="text-blue-600" />
              <p>Plaza de Armas s/n, Frías – Ayabaca – Piura, Perú</p>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Mail className="text-blue-600" />
              <p>informatica@munifrias.gob.pe</p>
            </div>
            <p className="text-sm text-gray-500">
              Horario de atención: Lunes a Viernes, 8:00 a.m. - 5:00 p.m.
            </p>
          </motion.div>
        </div>
      </section>

      {/* RAZONES */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            ¿Por qué escribirnos?
          </h2>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto">
            Queremos escucharte y que seas parte del Bicentenario de Frías.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 text-left">
            {[
              {
                emoji: "🎉",
                titulo: "Eventos",
                desc: "Postula o sugiere una actividad para el Bicentenario.",
              },
              {
                emoji: "📸",
                titulo: "Material histórico",
                desc: "Envíanos fotos, documentos o historias antiguas.",
              },
              {
                emoji: "🎤",
                titulo: "Testimonios",
                desc: "Cuéntanos tu experiencia en Frías. ¡Queremos compartirla!",
              },
              {
                emoji: "🤝",
                titulo: "Alianzas",
                desc: "ONGs o empresas pueden unirse a este esfuerzo.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className="font-semibold text-blue-700">{item.titulo}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REDES SOCIALES */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Síguenos en redes
          </h2>
          <p className="text-gray-600 mb-10">
            Mantente conectado con nuestras novedades y actividades.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white text-lg">
            {[
              {
                icon: FaFacebookF,
                url: "https://www.facebook.com/MunicipalidadDeFrias",
                color: "bg-blue-600",
              },
              {
                icon: FaInstagram,
                url: "https://www.instagram.com/md_frias/",
                color: "bg-pink-500",
              },
              {
                icon: FaYoutube,
                url: "https://www.youtube.com/@MunicipalidaddeFrías",
                color: "bg-red-600",
              },

              {
                icon: FaTiktok,
                url: "https://www.tiktok.com/@municipalidaddefrias",
                color: "bg-black",
              },
            ].map(({ icon: Icon, url, color }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 ${color} rounded-full flex items-center justify-center hover:scale-110 transition`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
