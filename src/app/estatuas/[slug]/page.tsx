import { supabase } from "@/lib/supabaseClient";
import EstatuaConMapa from "@/components/EstatuaConMapa";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EstatuaPage({ params }: Props) {
  // Awaita params antes de usar sus propiedades
  const { slug } = await params;

  const { data: estatua, error } = await supabase
    .from("estatuas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !estatua) {
    return (
      <div className="text-center text-red-600">Estatua no encontrada</div>
    );
  }

  return <EstatuaConMapa {...estatua} />;
}
