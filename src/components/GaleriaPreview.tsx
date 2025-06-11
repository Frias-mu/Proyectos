import Image from "next/image";
import Link from "next/link";

const imagenes = ["atardecer3.jpg", "noche1.jpg", "paisaje2.jpg", "noche3.jpg"];

export default function GaleriaPreview() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-8">
          📸 Galería de Frías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {imagenes.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow-md">
              <Image
                src={`/images/${img}`}
                alt={`Galería ${i + 1}`}
                width={600}
                height={400}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <Link
          href="/galeria"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded shadow"
        >
          Ver Galería Completa
        </Link>
      </div>
    </section>
  );
}
