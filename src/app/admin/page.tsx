"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        router.push("/admin/login");
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const secciones = [
    {
      title: "Contenido Turístico",
      links: [
        { href: "/admin/estatuas", label: "🗿 Estatuas" },
        { href: "/admin/hoteles", label: "🏨 Hoteles" },
        { href: "/admin/restaurantes", label: "🍽️ Restaurantes" },
        { href: "/admin/artistas", label: "🎭 Artistas" },
        { href: "/admin/lugares-turisticos", label: "📍 Lugares Turísticos" },
      ],
    },
    {
      title: "Operadores Turísticos",
      links: [
        {
          href: "/admin/empresas-transporte",
          label: "🚌 Empresas de Transporte",
        },
        {
          href: "/admin/establecimientos-recreacion",
          label: "🎡 Recreación",
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">
          Panel de Administración
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm shadow"
        >
          Cerrar sesión
        </button>
      </div>

      {userEmail && (
        <p className="text-sm text-gray-600 mb-6">
          Sesión iniciada como:{" "}
          <span className="font-medium text-gray-800">{userEmail}</span>
        </p>
      )}

      {secciones.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-5 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <span className="text-lg font-medium text-gray-800">
                  {link.label}
                </span>
                <span className="text-gray-400 text-xl">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
