export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          💪 FitnessTracker
        </h1>
        <p className="text-center text-lg mb-8">
          Acompanhe sua evolução física de forma simples e eficiente
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">📊 Medidas</h2>
            <p className="text-sm text-gray-600">
              Registre peso, medidas corporais e acompanhe sua evolução
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🏋️ Treinos</h2>
            <p className="text-sm text-gray-600">
              Acompanhe seus treinos e veja seu progresso
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🥗 Nutrição</h2>
            <p className="text-sm text-gray-600">
              Controle sua alimentação e hidratação
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-12">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Entrar
          </a>
          <a
            href="/auth/register"
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
          >
            Cadastrar
          </a>
        </div>
      </div>
    </main>
  )
}
