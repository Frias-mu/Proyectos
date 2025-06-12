"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import HeroVideo from "@/components/HeroVideo";
import DatosFrias from "@/components/DatosFrias";
import EstatuaGrid from "@/components/EstatuaGrid";
import SabiasQue from "@/components/SabiasQue";
import GaleriaPreview from "@/components/GaleriaPreview";
import BanderaFrias from "@/components/BanderaFrías";
import Testimonios from "@/components/Testimonios";
import { Estatua } from "@/types/Estatua";

export default function HomePage() {
  const [estatuas, setEstatuas] = useState<Estatua[]>([]);

  useEffect(() => {
    supabase
      .from("estatuas")
      .select("*")
      .then(({ data }) => setEstatuas(data || []));
  }, []);

  return (
    <main className="bg-white text-gray-900 scroll-smooth">
      <HeroVideo />
      <DatosFrias totalEstatuas={estatuas.length} />
      <EstatuaGrid estatuas={estatuas} />
      <BanderaFrias />
      <SabiasQue />
      <Testimonios />
      <GaleriaPreview />
    </main>
  );
}
