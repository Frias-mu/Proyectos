// src/components/Map.tsx
"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";

type MapProps = {
  latitud: number;
  longitud: number;
};

export default function Map({ latitud, longitud }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const center = useMemo(
    () => ({ lat: latitud, lng: longitud }),
    [latitud, longitud]
  );

  if (loadError)
    return <div className="text-red-600">Error al cargar el mapa</div>;
  if (!isLoaded) return <div className="text-gray-500">Cargando mapa...</div>;
  if (!latitud || !longitud)
    return <div className="text-yellow-600">Ubicación no disponible</div>;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
