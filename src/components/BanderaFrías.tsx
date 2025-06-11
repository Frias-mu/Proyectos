import { Flag } from "lucide-react";

export default function BanderaFrias() {
  return (
    <section className="bg-white py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-2">
          <Flag className="text-red-600" />
          Significado de la Bandera de Frías
        </h2>

        <div className="grid gap-6 sm:grid-cols-3 text-left text-sm sm:text-base">
          {/* CELESTE */}
          <div className="bg-blue-100 border-l-4 border-blue-400 p-4 rounded-lg shadow-sm">
            <h3 className="text-blue-700 font-bold mb-2">Celeste</h3>
            <p>
              Color del cielo, simboliza la esperanza, inocencia, constancia y
              fidelidad. Representa también lo agradable y lo delicioso.
            </p>
          </div>

          {/* VERDE */}
          <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded-lg shadow-sm">
            <h3 className="text-green-700 font-bold mb-2">Verde</h3>
            <p>
              Símbolo de la vida, el renacimiento y los campos verdes. Evoca
              esperanza, promesa, salvación, sabiduría y victoria.
            </p>
          </div>

          {/* ROJO */}
          <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
            <h3 className="text-red-700 font-bold mb-2">Rojo</h3>
            <p>
              Representa el amor divino, el fuego, la vida, la pasión y el
              triunfo. También el espíritu santo y la realeza.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
