export default function DatosFrias({
  totalEstatuas,
}: {
  totalEstatuas: number;
}) {
  const datos = [
    { label: "Fundación", value: "1825" },
    { label: "Habitantes", value: "25,909+" },
    { label: "Altitud", value: "1,650 msnm" },
    { label: "Estatuas", value: totalEstatuas },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-12">
          Frías en Datos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {datos.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow ring-1 ring-blue-100 hover:ring-blue-300 transition"
            >
              <div className="text-2xl font-bold text-blue-700">
                {item.value}
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
