"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname() ?? "";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historiaOpen, setHistoriaOpen] = useState(false);
  const [operadoresOpen, setOperadoresOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setHistoriaOpen(false);
    setOperadoresOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-blue-900/95 backdrop-blur shadow-md py-2"
            : "bg-blue-900/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/logoMuni.png"
                alt="Logo Municipalidad"
                width={40}
                height={40}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
              />
              <div className="ml-3">
                <span className="text-xl font-bold text-white">
                  Frías - Bicentenario
                </span>
                <span className="block text-xs text-yellow-300 font-medium mt-1">
                  200 años de historia
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <NavItem href="/" label="Inicio" active={isActive("/")} />
              <NavItem
                href="/estatuas"
                label="Estatuas"
                active={isActive("/estatuas")}
              />
              <DropdownDesktop
                label="Historia"
                href="/historia"
                active={["/historia", "/mapa", "/fiestas"].includes(pathname)}
                items={[
                  { label: "Mapa", href: "/mapa" },
                  { label: "Fiestas", href: "/fiestas" },
                  { label: "historia", href: "/historia" },
                ]}
              />
              <DropdownDesktop
                label="Operadores Turísticos"
                href="/operadores-turisticos"
                active={[
                  "/operadores-turisticos",
                  "/hoteles",
                  "/restaurantes",
                  "/transporte",
                  "/recreacion",
                ].includes(pathname)}
                items={[
                  { label: "Hoteles", href: "/hoteles" },
                  { label: "Restaurantes", href: "/restaurantes" },
                  { label: "Transporte", href: "/transporte" },
                  { label: "Recreación", href: "/recreacion" },
                ]}
              />
              <NavItem
                href="/artistas"
                label="Artistas"
                active={isActive("/artistas")}
              />
              <NavItem
                href="/galeria"
                label="Galería"
                active={isActive("/galeria")}
              />
              <NavItem
                href="/contacto"
                label="Contacto"
                active={isActive("/contacto")}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white hover:text-blue-200 focus:outline-none p-2"
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`transition-all duration-300 md:hidden overflow-hidden ${
            menuOpen ? "max-h-[600px]" : "max-h-0"
          }`}
        >
          <div className="bg-blue-800/95 px-4 py-4 space-y-2 text-white text-sm">
            <MobileNavItem href="/" label="Inicio" active={isActive("/")} />
            <MobileNavItem
              href="/estatuas"
              label="Estatuas"
              active={isActive("/estatuas")}
            />

            {/* Historia móvil */}
            <MobileDropdown
              label="Historia"
              open={historiaOpen}
              toggle={() => setHistoriaOpen(!historiaOpen)}
              activePaths={["/historia", "/mapa", "/fiestas"]}
              items={[
                { label: "• Ver todo", href: "/historia" },
                { label: "• Mapa", href: "/mapa" },
                { label: "• Fiestas", href: "/fiestas" },
              ]}
              pathname={pathname}
            />

            {/* Operadores móviles */}
            <MobileDropdown
              label="Operadores Turísticos"
              open={operadoresOpen}
              toggle={() => setOperadoresOpen(!operadoresOpen)}
              activePaths={[
                "/operadores-turisticos",
                "/hoteles",
                "/restaurantes",
                "/transporte",
                "/recreacion",
              ]}
              items={[
                { label: "• Ver todo", href: "/operadores-turisticos" },
                { label: "• Hoteles", href: "/hoteles" },
                { label: "• Restaurantes", href: "/restaurantes" },
                { label: "• Transporte", href: "/transporte" },
                { label: "• Recreación", href: "/recreacion" },
              ]}
              pathname={pathname}
            />

            <MobileNavItem
              href="/artistas"
              label="Artistas"
              active={isActive("/artistas")}
            />
            <MobileNavItem
              href="/galeria"
              label="Galería"
              active={isActive("/galeria")}
            />
            <MobileNavItem
              href="/contacto"
              label="Contacto"
              active={isActive("/contacto")}
            />
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[72px] sm:h-[80px]" />
    </>
  );
}

// COMPONENTES AUXILIARES

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative px-2 py-2 transition-colors ${
        active ? "text-yellow-300" : "text-white hover:text-yellow-200"
      }`}
    >
      {label}
    </Link>
  );
}

function DropdownDesktop({
  label,
  href,
  items,
  active,
}: {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`relative px-2 py-2 transition-colors ${
          active ? "text-yellow-300" : "text-white hover:text-yellow-200"
        }`}
      >
        {label}
      </Link>
      <div
        className={`absolute left-0 mt-2 w-56 bg-white rounded shadow-md transition-all duration-200 transform ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        } z-50`}
      >
        {items.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileNavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        active ? "bg-yellow-400/10 text-yellow-300" : "hover:bg-blue-700/50"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileDropdown({
  label,
  open,
  toggle,
  items,
  pathname,
  activePaths,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
  items: { label: string; href: string }[];
  pathname: string;
  activePaths: string[];
}) {
  return (
    <>
      <button
        onClick={toggle}
        className={`w-full text-left px-4 py-2 rounded-lg ${
          activePaths.includes(pathname)
            ? "bg-yellow-400/10 text-yellow-300"
            : "hover:bg-blue-700/50"
        }`}
        aria-expanded={open}
      >
        {label} <span className="float-right">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="pl-6 pt-1 space-y-1">
          {items.map(({ label, href }) => (
            <MobileNavItem
              key={href}
              href={href}
              label={label}
              active={pathname === href}
            />
          ))}
        </div>
      )}
    </>
  );
}
