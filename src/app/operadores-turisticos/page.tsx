"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import {
  BedDouble,
  Utensils,
  MapPin,
  Phone,
  Globe2,
  BusFront,
  Landmark,
} from "lucide-react";

import Image from "next/image";

type Tipo = "hotel" | "restaurante" | "transporte" | "recreacion";

type Item = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  slug: string;
  direccion?: string;
  telefono?: string;
  tipo?: string;
  redes_sociales?: Record<string, string>;
  categoria: Tipo;
};

export default function OperadoresTuristicosPage() {
  const [items, setItems] = useState<Record<Tipo, Item[]>>({
    hotel: [],
    restaurante: [],
    transporte: [],
    recreacion: [],
  });

  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [hoteles, restaurantes, transporte, recreacion] = await Promise.all(
        [
          supabase.from("hoteles").select("*"),
          supabase.from("restaurantes").select("*"),
          supabase.from("empresas_transporte").select("*"),
          supabase.from("establecimientos_recreacion").select("*"),
        ]
      );

      setItems({
        hotel: (hoteles.data || []).map((h) => ({ ...h, categoria: "hotel" })),
        restaurante: (restaurantes.data || []).map((r) => ({
          ...r,
          categoria: "restaurante",
        })),
        transporte: (transporte.data || []).map((t) => ({
          ...t,
          categoria: "transporte",
        })),
        recreacion: (recreacion.data || []).map((r) => ({
          ...r,
          categoria: "recreacion",
        })),
      });
    };

    fetchAll();
  }, []);

  const icons: Record<Tipo, React.ReactNode> = {
    hotel: <BedDouble size={20} className="text-blue-600" />,
    restaurante: <Utensils size={20} className="text-green-600" />,
    transporte: <BusFront size={20} className="text-amber-600" />,
    recreacion: <Landmark size={20} className="text-pink-600" />,
  };

  const titles: Record<Tipo, string> = {
    hotel: "Hoteles",
    restaurante: "Restaurantes",
    transporte: "Transporte",
    recreacion: "Recreación",
  };

  const links: Record<Tipo, string> = {
    hotel: "/hoteles",
    restaurante: "/restaurantes",
    transporte: "/transporte",
    recreacion: "/recreacion",
  };

  return (
    <main className="bg-white py-16 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-blue-800 mb-6"
        >
          Explorá los Operadores Turísticos
        </motion.h1>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12 text-sm sm:text-base">
          Conocé la oferta turística de Frías: alojamiento, gastronomía,
          transporte y recreación. Todos los servicios en un solo lugar para que
          tu experiencia sea completa.
        </p>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(items).map(([tipoKey, lista]) => {
            const tipo = tipoKey as Tipo;
            const preview = lista.slice(0, 3);

            return (
              <div
                key={tipo}
                className="bg-white shadow rounded-xl overflow-hidden border"
              >
                <div className="p-4 border-b flex items-center gap-2 text-gray-700 font-semibold text-lg">
                  {icons[tipo]}
                  {titles[tipo]}
                </div>

                <div className="divide-y">
                  {preview.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex justify-center items-center bg-gray-100">
                          <Image
                            src={item.imagen_url || "/placeholder.jpg"}
                            alt={item.nombre}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-800">
                            {item.nombre}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {item.descripcion || "Sin descripción disponible."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 text-right">
                  <Link
                    href={links[tipo]}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Ver todos →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal global mejorado */}
        {selected && (
          <Modal
            isOpen={!!selected}
            onClose={() => setSelected(null)}
            imageUrl={selected.imagen_url}
            imageAlt={selected.nombre}
            telefono={selected.telefono || undefined}
          >
            <h2 className="text-2xl font-bold text-blue-800">
              {selected.nombre}
            </h2>

            <p className="text-sm text-gray-700">
              {selected.descripcion || "Sin descripción disponible."}
            </p>

            {selected.direccion && (
              <p className="flex items-center text-sm text-gray-600 mt-3">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                {selected.direccion}
              </p>
            )}

            {selected.telefono && (
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <Phone className="mr-2 h-4 w-4 text-green-500" />
                {selected.telefono}
              </p>
            )}

            {selected.redes_sociales && (
              <div className="space-y-1 mt-4 text-sm">
                {Object.entries(selected.redes_sociales).map(([key, url]) => (
                  <p key={key} className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-gray-500" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {key}
                    </a>
                  </p>
                ))}
              </div>
            )}
          </Modal>
        )}
      </div>
    </main>
  );
}
