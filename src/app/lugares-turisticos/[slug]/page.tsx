import { supabase } from "@/lib/supabaseClient";
import LugarDetalle from "@/components/LugarDetalle";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LugarTuristicoPage({ params }: Props) {
  const { slug } = await params;
  const { data: lugar, error } = await supabase
    .from("lugares_turisticos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !lugar) {
    return (
      <div className="text-center text-red-600 py-10">Lugar no encontrado</div>
    );
  }

  return <LugarDetalle {...lugar} />;
}
