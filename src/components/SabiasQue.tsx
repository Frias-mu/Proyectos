export default function SabiasQue() {
  return (
    <section className="bg-blue-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-12">
          ¿Sabías que...?
        </h2>

        <div className="space-y-8">
          {" "}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <p className="text-lg text-gray-800 leading-relaxed">
              En Frías, además de la famosa Bella Durmiente, existe la creencia
              popular de que los **duendes son los guardianes de ciertas
              'huacas'** o lugares sagrados. Se dice que si te extravías en el
              campo, podrías haber caído en uno de sus 'encantos' o incluso
              haber 'bailado con ellos' en otra dimensión antes de volver a la
              realidad.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <p className="text-lg text-gray-800 leading-relaxed">
              Frías tiene su propia **"Diosa Frías"**, pero no es una deidad
              antigua. Se trata de una **Sala Cultural** que lleva este nombre,
              un espacio vibrante dedicado a promover y preservar el arte, la
              cultura y las ricas tradiciones del distrito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
