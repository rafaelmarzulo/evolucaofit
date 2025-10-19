'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Measurement {
  id: number
  measurement_date: string
  weight_kg: number
  body_fat_percentage?: number
  muscle_mass_kg?: number
  bmi?: number
  neck_cm?: number
  chest_cm?: number
  waist_cm?: number
  abdomen_cm?: number
  hips_cm?: number
  right_bicep_cm?: number
  left_bicep_cm?: number
  right_thigh_cm?: number
  left_thigh_cm?: number
  right_calf_cm?: number
  left_calf_cm?: number
}

export default function MeasurementsReportPage() {
  const router = useRouter()
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/measurements/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar medidas')

      const data = await response.json()
      const sorted = data.sort((a: Measurement, b: Measurement) =>
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
      )
      setMeasurements(sorted)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const chartData = measurements.map(m => ({
    date: formatDate(m.measurement_date),
    peso: m.weight_kg,
    gordura: m.body_fat_percentage,
    massaMuscular: m.muscle_mass_kg,
    imc: m.bmi,
    peitoral: m.chest_cm,
    cintura: m.waist_cm,
    abdomen: m.abdomen_cm,
    quadril: m.hips_cm,
    bicepsD: m.right_bicep_cm,
    bicepsE: m.left_bicep_cm,
    coxaD: m.right_thigh_cm,
    coxaE: m.left_thigh_cm,
    panturrilhaD: m.right_calf_cm,
    panturrilhaE: m.left_calf_cm,
  }))

  const calculateStats = () => {
    if (measurements.length < 2) return null

    const first = measurements[0]
    const last = measurements[measurements.length - 1]

    return {
      weight: {
        first: first.weight_kg,
        last: last.weight_kg,
        diff: last.weight_kg - first.weight_kg,
      },
      bodyFat: first.body_fat_percentage && last.body_fat_percentage ? {
        first: first.body_fat_percentage,
        last: last.body_fat_percentage,
        diff: last.body_fat_percentage - first.body_fat_percentage,
      } : null,
      muscle: first.muscle_mass_kg && last.muscle_mass_kg ? {
        first: first.muscle_mass_kg,
        last: last.muscle_mass_kg,
        diff: last.muscle_mass_kg - first.muscle_mass_kg,
      } : null,
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  if (measurements.length < 2) {
    return (
      <div className="min-h-screen bg-gray-950">
        <header className="bg-gray-900/50 backdrop-blur-xl shadow-lg shadow-black/20 border border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">📈 Relatório de Evolução</h1>
            <button
              onClick={() => router.push('/measurements')}
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              ← Voltar
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2">Dados Insuficientes</h2>
            <p className="text-gray-300 mb-6">
              Você precisa de pelo menos 2 medições para gerar o relatório de evolução.
            </p>
            <p className="text-sm text-gray-400">
              Medições registradas: {measurements.length}
            </p>
            <button
              onClick={() => router.push('/measurements')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Adicionar Medidas
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900/50 backdrop-blur-xl shadow-lg shadow-black/20 border border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">📈 Relatório de Evolução</h1>
          <button
            onClick={() => router.push('/measurements')}
            className="px-4 py-2 text-sm text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Resumo de Evolução */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Variação de Peso</h3>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-white">
                  {stats.weight.diff > 0 ? '+' : ''}{stats.weight.diff.toFixed(1)} kg
                </p>
                <p className={`text-sm text-gray-300 ${stats.weight.diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.weight.first.toFixed(1)} → {stats.weight.last.toFixed(1)} kg
                </p>
              </div>
            </div>

            {stats.bodyFat && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Variação de % Gordura</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-white">
                    {stats.bodyFat.diff > 0 ? '+' : ''}{stats.bodyFat.diff.toFixed(1)}%
                  </p>
                  <p className={`text-sm text-gray-300 ${stats.bodyFat.diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.bodyFat.first.toFixed(1)}% → {stats.bodyFat.last.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {stats.muscle && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Variação de Massa Muscular</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-white">
                    {stats.muscle.diff > 0 ? '+' : ''}{stats.muscle.diff.toFixed(1)} kg
                  </p>
                  <p className={`text-sm text-gray-300 ${stats.muscle.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.muscle.first.toFixed(1)} → {stats.muscle.last.toFixed(1)} kg
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gráficos */}
        <div className="space-y-6">
          {/* Peso */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Evolução do Peso</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} name="Peso (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* % Gordura e IMC */}
          {chartData.some(d => d.gordura || d.imc) && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">% Gordura Corporal e IMC</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData.some(d => d.gordura) && (
                    <Line type="monotone" dataKey="gordura" stroke="#ef4444" strokeWidth={2} name="% Gordura" />
                  )}
                  {chartData.some(d => d.imc) && (
                    <Line type="monotone" dataKey="imc" stroke="#f97316" strokeWidth={2} name="IMC" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Massa Muscular */}
          {chartData.some(d => d.massaMuscular) && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Evolução da Massa Muscular</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="massaMuscular" stroke="#22c55e" strokeWidth={2} name="Massa Muscular (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Circunferências - Tronco */}
          {chartData.some(d => d.peitoral || d.cintura || d.abdomen || d.quadril) && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Circunferências - Tronco</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData.some(d => d.peitoral) && (
                    <Line type="monotone" dataKey="peitoral" stroke="#3b82f6" strokeWidth={2} name="Peitoral (cm)" />
                  )}
                  {chartData.some(d => d.cintura) && (
                    <Line type="monotone" dataKey="cintura" stroke="#ef4444" strokeWidth={2} name="Cintura (cm)" />
                  )}
                  {chartData.some(d => d.abdomen) && (
                    <Line type="monotone" dataKey="abdomen" stroke="#f97316" strokeWidth={2} name="Abdômen (cm)" />
                  )}
                  {chartData.some(d => d.quadril) && (
                    <Line type="monotone" dataKey="quadril" stroke="#a855f7" strokeWidth={2} name="Quadril (cm)" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Circunferências - Braços */}
          {chartData.some(d => d.bicepsD || d.bicepsE) && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Circunferências - Braços</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData.some(d => d.bicepsD) && (
                    <Line type="monotone" dataKey="bicepsD" stroke="#3b82f6" strokeWidth={2} name="Bíceps D (cm)" />
                  )}
                  {chartData.some(d => d.bicepsE) && (
                    <Line type="monotone" dataKey="bicepsE" stroke="#22c55e" strokeWidth={2} name="Bíceps E (cm)" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Circunferências - Pernas */}
          {chartData.some(d => d.coxaD || d.coxaE || d.panturrilhaD || d.panturrilhaE) && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Circunferências - Pernas</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData.some(d => d.coxaD) && (
                    <Line type="monotone" dataKey="coxaD" stroke="#3b82f6" strokeWidth={2} name="Coxa D (cm)" />
                  )}
                  {chartData.some(d => d.coxaE) && (
                    <Line type="monotone" dataKey="coxaE" stroke="#22c55e" strokeWidth={2} name="Coxa E (cm)" />
                  )}
                  {chartData.some(d => d.panturrilhaD) && (
                    <Line type="monotone" dataKey="panturrilhaD" stroke="#f97316" strokeWidth={2} name="Panturrilha D (cm)" />
                  )}
                  {chartData.some(d => d.panturrilhaE) && (
                    <Line type="monotone" dataKey="panturrilhaE" stroke="#a855f7" strokeWidth={2} name="Panturrilha E (cm)" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-400">
            📊 Relatório gerado com {measurements.length} medições •
            Período: {new Date(measurements[0].measurement_date).toLocaleDateString('pt-BR')} a {new Date(measurements[measurements.length - 1].measurement_date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </main>
    </div>
  )
}
