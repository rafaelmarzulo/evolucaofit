'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

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
  right_forearm_cm?: number
  left_forearm_cm?: number
  right_thigh_cm?: number
  left_thigh_cm?: number
  right_calf_cm?: number
  left_calf_cm?: number
  notes?: string
}

export default function MeasurementsPage() {
  const router = useRouter()
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null)
  const [formData, setFormData] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    body_fat_percentage: '',
    muscle_mass_kg: '',
    neck_cm: '',
    chest_cm: '',
    waist_cm: '',
    abdomen_cm: '',
    hips_cm: '',
    right_bicep_cm: '',
    left_bicep_cm: '',
    right_forearm_cm: '',
    left_forearm_cm: '',
    right_thigh_cm: '',
    left_thigh_cm: '',
    right_calf_cm: '',
    left_calf_cm: '',
    notes: '',
  })

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/measurements/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar medidas')

      const data = await response.json()
      setMeasurements(data.sort((a: Measurement, b: Measurement) =>
        new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime()
      ))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const payload: any = {
      measurement_date: formData.measurement_date,
      weight_kg: parseFloat(formData.weight_kg),
    }

    // Adiciona campos opcionais apenas se preenchidos
    if (formData.body_fat_percentage) payload.body_fat_percentage = parseFloat(formData.body_fat_percentage)
    if (formData.muscle_mass_kg) payload.muscle_mass_kg = parseFloat(formData.muscle_mass_kg)
    if (formData.neck_cm) payload.neck_cm = parseFloat(formData.neck_cm)
    if (formData.chest_cm) payload.chest_cm = parseFloat(formData.chest_cm)
    if (formData.waist_cm) payload.waist_cm = parseFloat(formData.waist_cm)
    if (formData.abdomen_cm) payload.abdomen_cm = parseFloat(formData.abdomen_cm)
    if (formData.hips_cm) payload.hips_cm = parseFloat(formData.hips_cm)
    if (formData.right_bicep_cm) payload.right_bicep_cm = parseFloat(formData.right_bicep_cm)
    if (formData.left_bicep_cm) payload.left_bicep_cm = parseFloat(formData.left_bicep_cm)
    if (formData.right_forearm_cm) payload.right_forearm_cm = parseFloat(formData.right_forearm_cm)
    if (formData.left_forearm_cm) payload.left_forearm_cm = parseFloat(formData.left_forearm_cm)
    if (formData.right_thigh_cm) payload.right_thigh_cm = parseFloat(formData.right_thigh_cm)
    if (formData.left_thigh_cm) payload.left_thigh_cm = parseFloat(formData.left_thigh_cm)
    if (formData.right_calf_cm) payload.right_calf_cm = parseFloat(formData.right_calf_cm)
    if (formData.left_calf_cm) payload.left_calf_cm = parseFloat(formData.left_calf_cm)
    if (formData.notes) payload.notes = formData.notes

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/measurements/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao criar medida')

      await fetchMeasurements()
      setShowForm(false)
      resetForm()
      alert('Medida salva com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar medida')
    }
  }

  const resetForm = () => {
    setFormData({
      measurement_date: new Date().toISOString().split('T')[0],
      weight_kg: '',
      body_fat_percentage: '',
      muscle_mass_kg: '',
      neck_cm: '',
      chest_cm: '',
      waist_cm: '',
      abdomen_cm: '',
      hips_cm: '',
      right_bicep_cm: '',
      left_bicep_cm: '',
      right_forearm_cm: '',
      left_forearm_cm: '',
      right_thigh_cm: '',
      left_thigh_cm: '',
      right_calf_cm: '',
      left_calf_cm: '',
      notes: '',
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta medida?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/measurements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao excluir medida')

      await fetchMeasurements()
      alert('Medida excluída com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir medida')
    }
  }

  const viewDetails = (measurement: Measurement) => {
    setSelectedMeasurement(measurement)
  }

  return (
    <DashboardLayout title="📊 Medidas Corporais">
      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowForm(!showForm)
              setSelectedMeasurement(null)
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Nova Medida'}
          </button>
          <button
            onClick={() => router.push('/measurements/report')}
            className="px-4 py-2 text-blue-400 bg-blue-900/20 border border-blue-800 rounded-md hover:bg-blue-900/30"
          >
            📈 Ver Relatório de Evolução
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Adicionar Nova Medida</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Básicos */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Dados Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Data *</label>
                    <input
                      type="date"
                      required
                      value={formData.measurement_date}
                      onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="75.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">% Gordura</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.body_fat_percentage}
                      onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="15.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Massa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.muscle_mass_kg}
                      onChange={(e) => setFormData({ ...formData, muscle_mass_kg: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="45.0"
                    />
                  </div>
                </div>
              </div>

              {/* Circunferências - Tronco */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Circunferências - Tronco (cm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Pescoço</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.neck_cm}
                      onChange={(e) => setFormData({ ...formData, neck_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="38.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Peitoral</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.chest_cm}
                      onChange={(e) => setFormData({ ...formData, chest_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="100.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Cintura</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.waist_cm}
                      onChange={(e) => setFormData({ ...formData, waist_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="85.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Abdômen</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.abdomen_cm}
                      onChange={(e) => setFormData({ ...formData, abdomen_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="90.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Quadril</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hips_cm}
                      onChange={(e) => setFormData({ ...formData, hips_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="95.0"
                    />
                  </div>
                </div>
              </div>

              {/* Circunferências - Braços */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Circunferências - Braços (cm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Bíceps Direito</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.right_bicep_cm}
                      onChange={(e) => setFormData({ ...formData, right_bicep_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="35.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Bíceps Esquerdo</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.left_bicep_cm}
                      onChange={(e) => setFormData({ ...formData, left_bicep_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="35.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Antebraço Direito</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.right_forearm_cm}
                      onChange={(e) => setFormData({ ...formData, right_forearm_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="28.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Antebraço Esquerdo</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.left_forearm_cm}
                      onChange={(e) => setFormData({ ...formData, left_forearm_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="28.0"
                    />
                  </div>
                </div>
              </div>

              {/* Circunferências - Pernas */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Circunferências - Pernas (cm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Coxa Direita</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.right_thigh_cm}
                      onChange={(e) => setFormData({ ...formData, right_thigh_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="55.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Coxa Esquerda</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.left_thigh_cm}
                      onChange={(e) => setFormData({ ...formData, left_thigh_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="55.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Panturrilha Direita</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.right_calf_cm}
                      onChange={(e) => setFormData({ ...formData, right_calf_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="38.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Panturrilha Esquerda</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.left_calf_cm}
                      onChange={(e) => setFormData({ ...formData, left_calf_cm: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="38.0"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-200">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  rows={3}
                  placeholder="Anotações sobre esta medição..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Salvar Medida
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : measurements.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-12 text-center">
            <p className="text-gray-400">Nenhuma medida registrada ainda.</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Nova Medida" para começar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <div key={measurement.id} className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {new Date(measurement.measurement_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-gray-400">ID: #{measurement.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDetails(measurement)}
                      className="px-3 py-1 text-sm text-blue-400 bg-blue-900/20 rounded hover:bg-blue-900/30"
                    >
                      {selectedMeasurement?.id === measurement.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                    </button>
                    <button
                      onClick={() => handleDelete(measurement.id)}
                      className="px-3 py-1 text-sm text-red-400 bg-red-900/20 rounded hover:bg-red-900/30"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Peso</p>
                    <p className="text-lg font-semibold text-white">{measurement.weight_kg.toFixed(1)} kg</p>
                  </div>
                  {measurement.body_fat_percentage && (
                    <div>
                      <p className="text-sm text-gray-300">% Gordura</p>
                      <p className="text-lg font-semibold text-white">{measurement.body_fat_percentage.toFixed(1)}%</p>
                    </div>
                  )}
                  {measurement.bmi && (
                    <div>
                      <p className="text-sm text-gray-300">IMC</p>
                      <p className="text-lg font-semibold text-white">{measurement.bmi.toFixed(1)}</p>
                    </div>
                  )}
                  {measurement.muscle_mass_kg && (
                    <div>
                      <p className="text-sm text-gray-300">Massa Muscular</p>
                      <p className="text-lg font-semibold text-white">{measurement.muscle_mass_kg.toFixed(1)} kg</p>
                    </div>
                  )}
                </div>

                {selectedMeasurement?.id === measurement.id && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="font-semibold text-white mb-4">Circunferências Detalhadas</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Tronco */}
                      {(measurement.neck_cm || measurement.chest_cm || measurement.waist_cm ||
                        measurement.abdomen_cm || measurement.hips_cm) && (
                        <div>
                          <h5 className="font-medium text-gray-200 mb-2">Tronco</h5>
                          <div className="space-y-1 text-sm text-white">
                            {measurement.neck_cm && <p className="text-white">Pescoço: {measurement.neck_cm} cm</p>}
                            {measurement.chest_cm && <p className="text-white">Peitoral: {measurement.chest_cm} cm</p>}
                            {measurement.waist_cm && <p>Cintura: {measurement.waist_cm} cm</p>}
                            {measurement.abdomen_cm && <p>Abdômen: {measurement.abdomen_cm} cm</p>}
                            {measurement.hips_cm && <p>Quadril: {measurement.hips_cm} cm</p>}
                          </div>
                        </div>
                      )}

                      {/* Braços */}
                      {(measurement.right_bicep_cm || measurement.left_bicep_cm ||
                        measurement.right_forearm_cm || measurement.left_forearm_cm) && (
                        <div>
                          <h5 className="font-medium text-gray-200 mb-2">Braços</h5>
                          <div className="space-y-1 text-sm text-white">
                            {measurement.right_bicep_cm && <p>Bíceps D: {measurement.right_bicep_cm} cm</p>}
                            {measurement.left_bicep_cm && <p>Bíceps E: {measurement.left_bicep_cm} cm</p>}
                            {measurement.right_forearm_cm && <p>Antebraço D: {measurement.right_forearm_cm} cm</p>}
                            {measurement.left_forearm_cm && <p>Antebraço E: {measurement.left_forearm_cm} cm</p>}
                          </div>
                        </div>
                      )}

                      {/* Pernas */}
                      {(measurement.right_thigh_cm || measurement.left_thigh_cm ||
                        measurement.right_calf_cm || measurement.left_calf_cm) && (
                        <div>
                          <h5 className="font-medium text-gray-200 mb-2">Pernas</h5>
                          <div className="space-y-1 text-sm text-white">
                            {measurement.right_thigh_cm && <p>Coxa D: {measurement.right_thigh_cm} cm</p>}
                            {measurement.left_thigh_cm && <p>Coxa E: {measurement.left_thigh_cm} cm</p>}
                            {measurement.right_calf_cm && <p>Panturrilha D: {measurement.right_calf_cm} cm</p>}
                            {measurement.left_calf_cm && <p>Panturrilha E: {measurement.left_calf_cm} cm</p>}
                          </div>
                        </div>
                      )}
                    </div>

                    {measurement.notes && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-700 mb-2">Observações</h5>
                        <p className="text-sm text-gray-300">{measurement.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
