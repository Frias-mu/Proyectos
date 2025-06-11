import "../styles/globals.css";

import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Descubre Frías",
  description: "Explora las maravillas turísticas del distrito de Frías.",
  icons: {
    icon: "/icon1.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
        <Navbar />

        {/* 🔄 Se elimina container y márgenes para full width */}
        <main className="flex-grow w-full">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
