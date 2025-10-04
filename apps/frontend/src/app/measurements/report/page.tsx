'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const chartRefs = {
    weight: useRef<HTMLCanvasElement>(null),
    bodyFat: useRef<HTMLCanvasElement>(null),
    muscle: useRef<HTMLCanvasElement>(null),
    trunk: useRef<HTMLCanvasElement>(null),
    arms: useRef<HTMLCanvasElement>(null),
    legs: useRef<HTMLCanvasElement>(null),
  }

  useEffect(() => {
    fetchMeasurements()
  }, [])

  useEffect(() => {
    if (measurements.length > 0) {
      renderCharts()
    }
  }, [measurements])

  const fetchMeasurements = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/measurements/`, {
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

  const renderCharts = () => {
    if (typeof window === 'undefined') return

    // Carregar Chart.js dinamicamente
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
    script.onload = () => createCharts()
    document.head.appendChild(script)
  }

  const createCharts = () => {
    const Chart = (window as any).Chart

    const dates = measurements.map(m =>
      new Date(m.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    )

    const chartConfig = {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    }

    // Gráfico de Peso
    if (chartRefs.weight.current) {
      const ctx = chartRefs.weight.current.getContext('2d')
      new Chart(ctx, {
        ...chartConfig,
        data: {
          labels: dates,
          datasets: [{
            label: 'Peso (kg)',
            data: measurements.map(m => m.weight_kg),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          }],
        },
      })
    }

    // Gráfico de % Gordura e IMC
    if (chartRefs.bodyFat.current) {
      const ctx = chartRefs.bodyFat.current.getContext('2d')
      const datasets = []

      if (measurements.some(m => m.body_fat_percentage)) {
        datasets.push({
          label: '% Gordura',
          data: measurements.map(m => m.body_fat_percentage || null),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.bmi)) {
        datasets.push({
          label: 'IMC',
          data: measurements.map(m => m.bmi || null),
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
        })
      }

      if (datasets.length > 0) {
        new Chart(ctx, {
          ...chartConfig,
          data: { labels: dates, datasets },
        })
      }
    }

    // Gráfico de Massa Muscular
    if (chartRefs.muscle.current && measurements.some(m => m.muscle_mass_kg)) {
      const ctx = chartRefs.muscle.current.getContext('2d')
      new Chart(ctx, {
        ...chartConfig,
        data: {
          labels: dates,
          datasets: [{
            label: 'Massa Muscular (kg)',
            data: measurements.map(m => m.muscle_mass_kg || null),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
          }],
        },
      })
    }

    // Gráfico de Circunferências - Tronco
    if (chartRefs.trunk.current) {
      const ctx = chartRefs.trunk.current.getContext('2d')
      const datasets = []

      if (measurements.some(m => m.chest_cm)) {
        datasets.push({
          label: 'Peitoral (cm)',
          data: measurements.map(m => m.chest_cm || null),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.waist_cm)) {
        datasets.push({
          label: 'Cintura (cm)',
          data: measurements.map(m => m.waist_cm || null),
          borderColor: 'rgb(239, 68, 68)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.abdomen_cm)) {
        datasets.push({
          label: 'Abdômen (cm)',
          data: measurements.map(m => m.abdomen_cm || null),
          borderColor: 'rgb(249, 115, 22)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.hips_cm)) {
        datasets.push({
          label: 'Quadril (cm)',
          data: measurements.map(m => m.hips_cm || null),
          borderColor: 'rgb(168, 85, 247)',
          tension: 0.4,
        })
      }

      if (datasets.length > 0) {
        new Chart(ctx, {
          ...chartConfig,
          data: { labels: dates, datasets },
        })
      }
    }

    // Gráfico de Circunferências - Braços
    if (chartRefs.arms.current) {
      const ctx = chartRefs.arms.current.getContext('2d')
      const datasets = []

      if (measurements.some(m => m.right_bicep_cm)) {
        datasets.push({
          label: 'Bíceps Direito (cm)',
          data: measurements.map(m => m.right_bicep_cm || null),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.left_bicep_cm)) {
        datasets.push({
          label: 'Bíceps Esquerdo (cm)',
          data: measurements.map(m => m.left_bicep_cm || null),
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.4,
        })
      }

      if (datasets.length > 0) {
        new Chart(ctx, {
          ...chartConfig,
          data: { labels: dates, datasets },
        })
      }
    }

    // Gráfico de Circunferências - Pernas
    if (chartRefs.legs.current) {
      const ctx = chartRefs.legs.current.getContext('2d')
      const datasets = []

      if (measurements.some(m => m.right_thigh_cm)) {
        datasets.push({
          label: 'Coxa Direita (cm)',
          data: measurements.map(m => m.right_thigh_cm || null),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.left_thigh_cm)) {
        datasets.push({
          label: 'Coxa Esquerda (cm)',
          data: measurements.map(m => m.left_thigh_cm || null),
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.right_calf_cm)) {
        datasets.push({
          label: 'Panturrilha Direita (cm)',
          data: measurements.map(m => m.right_calf_cm || null),
          borderColor: 'rgb(249, 115, 22)',
          tension: 0.4,
        })
      }

      if (measurements.some(m => m.left_calf_cm)) {
        datasets.push({
          label: 'Panturrilha Esquerda (cm)',
          data: measurements.map(m => m.left_calf_cm || null),
          borderColor: 'rgb(168, 85, 247)',
          tension: 0.4,
        })
      }

      if (datasets.length > 0) {
        new Chart(ctx, {
          ...chartConfig,
          data: { labels: dates, datasets },
        })
      }
    }
  }

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (measurements.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">📈 Relatório de Evolução</h1>
            <button
              onClick={() => router.push('/measurements')}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              ← Voltar
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados Insuficientes</h2>
            <p className="text-gray-600 mb-6">
              Você precisa de pelo menos 2 medições para gerar o relatório de evolução.
            </p>
            <p className="text-sm text-gray-500">
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">📈 Relatório de Evolução</h1>
          <button
            onClick={() => router.push('/measurements')}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Resumo de Evolução */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Variação de Peso</h3>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {stats.weight.diff > 0 ? '+' : ''}{stats.weight.diff.toFixed(1)} kg
                </p>
                <p className={`text-sm ${stats.weight.diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.weight.first.toFixed(1)} → {stats.weight.last.toFixed(1)} kg
                </p>
              </div>
            </div>

            {stats.bodyFat && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Variação de % Gordura</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.bodyFat.diff > 0 ? '+' : ''}{stats.bodyFat.diff.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${stats.bodyFat.diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.bodyFat.first.toFixed(1)}% → {stats.bodyFat.last.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {stats.muscle && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Variação de Massa Muscular</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.muscle.diff > 0 ? '+' : ''}{stats.muscle.diff.toFixed(1)} kg
                  </p>
                  <p className={`text-sm ${stats.muscle.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Evolução do Peso</h2>
            <div className="h-64">
              <canvas ref={chartRefs.weight}></canvas>
            </div>
          </div>

          {/* % Gordura e IMC */}
          {measurements.some(m => m.body_fat_percentage || m.bmi) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">% Gordura Corporal e IMC</h2>
              <div className="h-64">
                <canvas ref={chartRefs.bodyFat}></canvas>
              </div>
            </div>
          )}

          {/* Massa Muscular */}
          {measurements.some(m => m.muscle_mass_kg) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Evolução da Massa Muscular</h2>
              <div className="h-64">
                <canvas ref={chartRefs.muscle}></canvas>
              </div>
            </div>
          )}

          {/* Circunferências - Tronco */}
          {measurements.some(m => m.chest_cm || m.waist_cm || m.abdomen_cm || m.hips_cm) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Circunferências - Tronco</h2>
              <div className="h-64">
                <canvas ref={chartRefs.trunk}></canvas>
              </div>
            </div>
          )}

          {/* Circunferências - Braços */}
          {measurements.some(m => m.right_bicep_cm || m.left_bicep_cm) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Circunferências - Braços</h2>
              <div className="h-64">
                <canvas ref={chartRefs.arms}></canvas>
              </div>
            </div>
          )}

          {/* Circunferências - Pernas */}
          {measurements.some(m => m.right_thigh_cm || m.left_thigh_cm || m.right_calf_cm || m.left_calf_cm) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Circunferências - Pernas</h2>
              <div className="h-64">
                <canvas ref={chartRefs.legs}></canvas>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📊 Relatório gerado com {measurements.length} medições •
            Período: {new Date(measurements[0].measurement_date).toLocaleDateString('pt-BR')} a {new Date(measurements[measurements.length - 1].measurement_date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </main>
    </div>
  )
}
