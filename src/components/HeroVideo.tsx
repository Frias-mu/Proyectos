import Link from "next/link";

export default function HeroVideo() {
  return (
    <section className="relative w-full h-[50vh] flex items-center justify-center text-white text-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/bella1-1.jpg"
      >
        <source src="/videos/video_frias.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Frías te da la bienvenida
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-200 max-w-xl">
          200 años de historia, cultura y tradición viva.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="#estatuas"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow font-semibold"
          >
            Explorar Estatuas
          </Link>
          <Link
            href="/mapa"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow font-semibold"
          >
            Ver Mapa
          </Link>
        </div>
      </div>
    </section>
  );
}
