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
          label: "🎡 Establecimientos de Recreación",
        },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {userEmail && (
        <p className="text-sm text-gray-600 mb-6">
          Sesión iniciada como: <span className="font-medium">{userEmail}</span>
        </p>
      )}

      {secciones.map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-gray-200 p-6 rounded-lg hover:bg-gray-50 shadow-sm flex items-center justify-between transition"
              >
                <span className="text-lg font-medium">{link.label}</span>
                <span className="text-gray-400 text-xl">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
