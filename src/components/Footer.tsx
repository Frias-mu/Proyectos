import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#E6F0FA] text-[#1A365D] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {/* Marca / Descripción */}
          <div>
            <h2 className="text-xl font-bold text-[#2B6CB0] mb-3">
              Descubre Frías
            </h2>
            <p className="leading-relaxed text-[#1A365D]/80">
              Portal turístico y cultural del distrito de Frías, Ayabaca –
              Piura. Celebramos la belleza natural y tradición de nuestra
              tierra.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-[#2B6CB0] font-semibold mb-3">Explora</h3>
            <ul className="space-y-2 text-[#1A365D]/90">
              <li>
                <Link href="/" className="hover:text-[#2B6CB0] transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/artistas"
                  className="hover:text-[#2B6CB0] transition"
                >
                  Artistas
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurantes"
                  className="hover:text-[#2B6CB0] transition"
                >
                  Gastronomía
                </Link>
              </li>
              <li>
                <Link
                  href="/hoteles"
                  className="hover:text-[#2B6CB0] transition"
                >
                  Hospedaje
                </Link>
              </li>
              <li>
                <Link
                  href="/galeria"
                  className="hover:text-[#2B6CB0] transition"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-[#2B6CB0] transition"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y redes */}
          <div>
            <h3 className="text-[#2B6CB0] font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-[#1A365D]/90">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2B6CB0]" />
                <a
                  href="mailto:info@descubrefrias.pe"
                  className="hover:underline"
                >
                  info@descubrefrias.pe
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[#2B6CB0]" />
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#2B6CB0]" />
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer inferior */}
        <div className="mt-10 border-t border-[#BFD7ED] pt-4 text-center text-[#1A365D]/70 text-xs">
          © {new Date().getFullYear()} Descubre Frías. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
