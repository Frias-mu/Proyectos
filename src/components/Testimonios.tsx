"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonios = [
  {
    mensaje:
      "Frías no es solo un pueblo, es una historia viva que camina con nosotros.",
    autor: "Rocío H., cronista local",
  },
  {
    mensaje: "200 años de cultura, tradición y gente que deja huella.",
    autor: "Luis C., maestro jubilado",
  },
  {
    mensaje: "El corazón del Alto Piura late fuerte en cada calle de Frías.",
    autor: "Elena G., visitante frecuente",
  },
  {
    mensaje:
      "Celebro cada año, pero los 200 me hacen sentir más orgulloso que nunca.",
    autor: "Carlos A., músico tradicional",
  },
  {
    mensaje: "Frías: tierra de esperanza, lucha y belleza eterna.",
    autor: "Ana L., artesana local",
  },
];

export default function Testimonios() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonios.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const { mensaje, autor } = testimonios[index];

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-10">
        200 Años de Orgullo y Testimonios
      </h2>

      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white border border-purple-200 shadow-lg rounded-xl px-6 py-8 text-gray-800"
          >
            <Quote className="absolute -top-5 left-4 text-purple-200 w-10 h-10" />
            <p className="text-lg italic leading-relaxed">“{mensaje}”</p>
            <p className="mt-4 text-sm text-purple-600 font-semibold">
              — {autor}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {testimonios.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-purple-600 scale-110" : "bg-purple-300"
            }`}
            onClick={() => setIndex(i)}
          ></button>
        ))}
      </div>
    </section>
  );
}
