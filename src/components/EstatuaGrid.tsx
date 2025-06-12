"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Estatua } from "@/types/Estatua";

export default function EstatuaGrid({ estatuas }: { estatuas: Estatua[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" id="estatuas">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-800">
        Estatuas Históricas de Frías
      </h2>

      <div className="relative">
        {/* Flechas navegación */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow hover:bg-blue-100 z-10 p-2 rounded-full"
          aria-label="Scroll left"
        >
          <ChevronLeft className="text-blue-700 w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scroll-smooth pb-4 px-1"
        >
          {estatuas.map((e) => (
            <Link
              key={e.id}
              href={`/estatuas/${e.slug}`}
              className="min-w-[280px] max-w-xs bg-white rounded-xl shadow hover:shadow-lg transition flex-shrink-0"
            >
              <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                <Image
                  src={e.imagen_url}
                  alt={e.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold text-blue-900">{e.nombre}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {e.descripcion}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow hover:bg-blue-100 z-10 p-2 rounded-full"
          aria-label="Scroll right"
        >
          <ChevronRight className="text-blue-700 w-5 h-5" />
        </button>
      </div>

      {estatuas.length > 6 && (
        <div className="text-center mt-8">
          <Link
            href="/estatuas"
            className="text-blue-600 hover:underline font-medium"
          >
            Ver todas las estatuas →
          </Link>
        </div>
      )}
    </section>
  );
}
