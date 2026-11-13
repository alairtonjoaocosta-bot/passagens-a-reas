export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Aero<span className="text-blue-600">Search</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Pesquise passagens aéreas em tempo real com dados oficiais de companhias aéreas e redirecionamento direto para emissão.
        </p>
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          Motor de busca e BFF em inicialização conforme especificações do projeto.
        </div>
      </div>
    </main>
  );
}

