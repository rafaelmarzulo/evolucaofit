'use client'

import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Medidas */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">📊 Medidas</h2>
          </div>
          <p className="text-gray-300 mb-4">Registre suas medidas corporais</p>
          <button
            onClick={() => router.push('/measurements')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Acessar Medidas
          </button>
        </div>

        {/* Card 2 - Treinos */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">🏋️ Treinos</h2>
          </div>
          <p className="text-gray-300 mb-4">Acompanhe seus treinos</p>
          <button
            onClick={() => router.push('/workouts')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Acessar Treinos
          </button>
        </div>

        {/* Card 3 - Nutrição */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">🥗 Nutrição</h2>
          </div>
          <p className="text-gray-300 mb-4">Controle sua alimentação</p>
          <button
            onClick={() => router.push('/nutrition')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Acessar Nutrição
          </button>
        </div>

        {/* Card 4 - Fotos */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">📸 Fotos</h2>
          </div>
          <p className="text-gray-300 mb-4">Registre seu progresso visual</p>
          <button
            onClick={() => router.push('/photos')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Acessar Fotos
          </button>
        </div>

        {/* Card 5 - Metas */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">🎯 Metas</h2>
          </div>
          <p className="text-gray-300 mb-4">Defina e acompanhe seus objetivos</p>
          <button
            onClick={() => router.push('/goals')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Acessar Metas
          </button>
        </div>

        {/* Card 6 - Relatório */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">📈 Relatório</h2>
          </div>
          <p className="text-gray-300 mb-4">Visualize sua evolução</p>
          <button
            onClick={() => router.push('/measurements/report')}
            className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Ver Evolução
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">🚀 Início Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">1.</span>
            <span>Registre suas <strong>medidas corporais</strong> iniciais</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">2.</span>
            <span>Defina suas <strong>metas</strong> de evolução</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">3.</span>
            <span>Registre seus <strong>treinos</strong> e <strong>refeições</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">4.</span>
            <span>Acompanhe seu progresso com <strong>fotos</strong> e <strong>gráficos</strong></span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
