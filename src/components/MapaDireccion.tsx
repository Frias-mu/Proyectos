"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type MapaDireccionProps = {
  destinoLat: number;
  destinoLng: number;
};

const PLAZA_LAT = -4.931543802583803;
const PLAZA_LNG = -79.94716856638892;

export default function MapaDireccion({
  destinoLat,
  destinoLng,
}: MapaDireccionProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!apiKey) {
    return (
      <div className="text-red-600">API Key de Google Maps no encontrada</div>
    );
  }

  const iframeUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${PLAZA_LAT},${PLAZA_LNG}&destination=${destinoLat},${destinoLng}&mode=driving`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${PLAZA_LAT},${PLAZA_LNG}&destination=${destinoLat},${destinoLng}&travelmode=walking`;

  return (
    <div ref={containerRef} className="mt-10 px-4 sm:px-0 space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
          Cómo llegar desde la Plaza de Armas
        </h2>
        <p className="text-sm text-gray-600">
          Visualiza un tramo de referencia o abre la ruta completa en Google
          Maps.
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
        {visible ? (
          <iframe
            title="Ruta desde la Plaza de Armas"
            src={iframeUrl}
            className="w-full h-[250px] sm:h-[320px]"
            allowFullScreen
            loading="lazy"
            style={{ border: 0 }}
          ></iframe>
        ) : (
          <div className="w-full h-[250px] sm:h-[320px] flex items-center justify-center text-gray-400 text-sm">
            Cargando mapa…
          </div>
        )}
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full sm:w-auto justify-center sm:inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium py-2 px-4 rounded transition"
      >
        <MapPin className="w-5 h-5 mr-2" />
        Ver ruta en Google Maps
      </a>
    </div>
  );
}
