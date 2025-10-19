'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  is_verified: boolean
  is_admin: boolean
  created_at: string
  last_login: string | null
  height_cm: number | null
  target_weight_kg: number | null
}

interface Measurement {
  id: number
  user_id: number
  measurement_date: string
  weight_kg: number
  body_fat_percentage: number | null
  muscle_mass_kg: number | null
  bmi: number | null
  neck_cm: number | null
  chest_cm: number | null
  waist_cm: number | null
  abdomen_cm: number | null
  hip_cm: number | null
  right_bicep_cm: number | null
  left_bicep_cm: number | null
  right_forearm_cm: number | null
  left_forearm_cm: number | null
  right_thigh_cm: number | null
  left_thigh_cm: number | null
  right_calf_cm: number | null
  left_calf_cm: number | null
  notes: string | null
}

interface UserData {
  user: User
  measurements: Measurement[]
  total_measurements: number
}

export default function AdminUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMeasurement, setExpandedMeasurement] = useState<number | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/admin/users/${userId}/measurements`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acesso negado')
        }
        throw new Error('Erro ao buscar dados do usuário')
      }

      const userData = await response.json()
      setData(userData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (measurementId: number) => {
    if (expandedMeasurement === measurementId) {
      setExpandedMeasurement(null)
    } else {
      setExpandedMeasurement(measurementId)
    }
  }

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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Erro</h2>
          <p className="text-gray-600 text-center mb-6">{error || 'Usuário não encontrado'}</p>
          <button
            onClick={() => router.push('/admin')}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar ao Painel Admin
          </button>
        </div>
      </div>
    )
  }

  const { user, measurements, total_measurements } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Usuário</h1>
            <p className="text-sm text-gray-600 mt-1">{user.full_name}</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Voltar ao Painel
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="text-lg font-semibold text-gray-900">#{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="text-lg font-semibold text-gray-900">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verificado</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.is_verified ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.is_admin ? 'Administrador' : 'Usuário'}
              </span>
            </div>
            {user.height_cm && (
              <div>
                <p className="text-sm text-gray-600">Altura</p>
                <p className="text-lg font-semibold text-gray-900">{user.height_cm} cm</p>
              </div>
            )}
            {user.target_weight_kg && (
              <div>
                <p className="text-sm text-gray-600">Peso Alvo</p>
                <p className="text-lg font-semibold text-gray-900">{user.target_weight_kg} kg</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Cadastro</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            {user.last_login && (
              <div>
                <p className="text-sm text-gray-600">Último Login</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.last_login).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Measurements Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Medidas Corporais</h2>
              <p className="text-sm text-gray-600">Total: {total_measurements} medição(ões)</p>
            </div>
            {measurements.length >= 2 && (
              <button
                onClick={() => router.push(`/admin/users/${userId}/report`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                📈 Ver Relatório de Evolução
              </button>
            )}
          </div>

          {measurements.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Este usuário ainda não possui medidas cadastradas.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {measurements.map((measurement) => (
                <div key={measurement.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Data da Medição</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(measurement.measurement_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpanded(measurement.id)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {expandedMeasurement === measurement.id ? '▼ Ocultar Detalhes' : '▶ Ver Detalhes'}
                    </button>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Peso</p>
                      <p className="text-lg font-semibold text-gray-900">{measurement.weight_kg.toFixed(1)} kg</p>
                    </div>
                    {measurement.body_fat_percentage !== null && (
                      <div>
                        <p className="text-sm text-gray-600">Gordura Corporal</p>
                        <p className="text-lg font-semibold text-gray-900">{measurement.body_fat_percentage.toFixed(1)}%</p>
                      </div>
                    )}
                    {measurement.bmi !== null && (
                      <div>
                        <p className="text-sm text-gray-600">IMC</p>
                        <p className="text-lg font-semibold text-gray-900">{measurement.bmi.toFixed(1)}</p>
                      </div>
                    )}
                    {measurement.muscle_mass_kg !== null && (
                      <div>
                        <p className="text-sm text-gray-600">Massa Muscular</p>
                        <p className="text-lg font-semibold text-gray-900">{measurement.muscle_mass_kg.toFixed(1)} kg</p>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedMeasurement === measurement.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {/* Trunk Circumferences */}
                      {(measurement.neck_cm || measurement.chest_cm || measurement.waist_cm ||
                        measurement.abdomen_cm || measurement.hip_cm) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Circunferências do Tronco</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {measurement.neck_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Pescoço</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.neck_cm} cm</p>
                              </div>
                            )}
                            {measurement.chest_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Peitoral</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.chest_cm} cm</p>
                              </div>
                            )}
                            {measurement.waist_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Cintura</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.waist_cm} cm</p>
                              </div>
                            )}
                            {measurement.abdomen_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Abdômen</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.abdomen_cm} cm</p>
                              </div>
                            )}
                            {measurement.hip_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Quadril</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.hip_cm} cm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Arm Circumferences */}
                      {(measurement.right_bicep_cm || measurement.left_bicep_cm ||
                        measurement.right_forearm_cm || measurement.left_forearm_cm) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Circunferências dos Braços</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {measurement.right_bicep_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Bíceps Direito</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.right_bicep_cm} cm</p>
                              </div>
                            )}
                            {measurement.left_bicep_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Bíceps Esquerdo</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.left_bicep_cm} cm</p>
                              </div>
                            )}
                            {measurement.right_forearm_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Antebraço Direito</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.right_forearm_cm} cm</p>
                              </div>
                            )}
                            {measurement.left_forearm_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Antebraço Esquerdo</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.left_forearm_cm} cm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Leg Circumferences */}
                      {(measurement.right_thigh_cm || measurement.left_thigh_cm ||
                        measurement.right_calf_cm || measurement.left_calf_cm) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Circunferências das Pernas</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {measurement.right_thigh_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Coxa Direita</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.right_thigh_cm} cm</p>
                              </div>
                            )}
                            {measurement.left_thigh_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Coxa Esquerda</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.left_thigh_cm} cm</p>
                              </div>
                            )}
                            {measurement.right_calf_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Panturrilha Direita</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.right_calf_cm} cm</p>
                              </div>
                            )}
                            {measurement.left_calf_cm && (
                              <div>
                                <p className="text-sm text-gray-600">Panturrilha Esquerda</p>
                                <p className="text-base font-semibold text-gray-900">{measurement.left_calf_cm} cm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {measurement.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">{measurement.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
