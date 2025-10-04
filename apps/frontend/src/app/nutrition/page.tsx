'use client'

import { useRouter } from 'next/navigation'

export default function NutritionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🥗 Nutrição</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Em Desenvolvimento</h2>
          <p className="text-gray-600 mb-6">
            A funcionalidade de Nutrição está sendo desenvolvida e estará disponível em breve.
          </p>
          <div className="bg-white rounded-lg p-6 mt-6 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Funcionalidades planejadas:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Registro de refeições diárias</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Contagem de calorias e macronutrientes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Planejamento de dieta personalizada</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Controle de ingestão de água</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Receitas saudáveis e dicas nutricionais</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
