'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface Goal {
  id: number
  goal_type: string
  title: string
  description?: string
  target_weight_kg?: number
  target_body_fat_percentage?: number
  target_muscle_mass_kg?: number
  target_value?: number
  target_unit?: string
  start_date: string
  target_date?: string
  completed_date?: string
  is_completed: boolean
  is_active: boolean
  current_progress?: number
  notes?: string
  created_at: string
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')
  const [formData, setFormData] = useState({
    goal_type: '',
    title: '',
    description: '',
    target_weight_kg: '',
    target_body_fat_percentage: '',
    target_muscle_mass_kg: '',
    target_value: '',
    target_unit: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    notes: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [filter])

  const fetchGoals = async () => {
    const token = localStorage.getItem('token')

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/`
      const params = new URLSearchParams()

      if (filter === 'active') params.append('is_active', 'true')
      if (filter === 'completed') params.append('is_completed', 'true')

      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar metas')

      const data = await response.json()
      setGoals(data.sort((a: Goal, b: Goal) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
      goal_type: formData.goal_type,
      title: formData.title,
      start_date: formData.start_date,
    }

    if (formData.description) payload.description = formData.description
    if (formData.target_weight_kg) payload.target_weight_kg = parseFloat(formData.target_weight_kg)
    if (formData.target_body_fat_percentage) payload.target_body_fat_percentage = parseFloat(formData.target_body_fat_percentage)
    if (formData.target_muscle_mass_kg) payload.target_muscle_mass_kg = parseFloat(formData.target_muscle_mass_kg)
    if (formData.target_value) payload.target_value = parseFloat(formData.target_value)
    if (formData.target_unit) payload.target_unit = formData.target_unit
    if (formData.target_date) payload.target_date = formData.target_date
    if (formData.notes) payload.notes = formData.notes

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao criar meta')

      await fetchGoals()
      setShowForm(false)
      resetForm()
      alert('Meta criada com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao criar meta')
    }
  }

  const resetForm = () => {
    setFormData({
      goal_type: '',
      title: '',
      description: '',
      target_weight_kg: '',
      target_body_fat_percentage: '',
      target_muscle_mass_kg: '',
      target_value: '',
      target_unit: '',
      start_date: new Date().toISOString().split('T')[0],
      target_date: '',
      notes: '',
    })
  }

  const handleComplete = async (id: number) => {
    if (!confirm('Marcar esta meta como concluída?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_completed: true,
          completed_date: new Date().toISOString().split('T')[0]
        }),
      })

      if (!response.ok) throw new Error('Erro ao completar meta')

      await fetchGoals()
      alert('Meta marcada como concluída!')
    } catch (error) {
      console.error(error)
      alert('Erro ao completar meta')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta meta?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao excluir meta')

      await fetchGoals()
      alert('Meta excluída com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir meta')
    }
  }

  const goalTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'weight_loss': 'Perda de Peso',
      'muscle_gain': 'Ganho de Massa Muscular',
      'endurance': 'Resistência',
      'strength': 'Força',
      'flexibility': 'Flexibilidade',
      'body_fat': 'Redução de Gordura',
      'custom': 'Personalizada'
    }
    return types[type] || type
  }

  const goalTypeEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      'weight_loss': '⚖️',
      'muscle_gain': '💪',
      'endurance': '🏃',
      'strength': '🏋️',
      'flexibility': '🧘',
      'body_fat': '📉',
      'custom': '🎯'
    }
    return emojis[type] || '🎯'
  }

  const calculateProgress = (goal: Goal) => {
    if (goal.current_progress != null) {
      return goal.current_progress
    }
    // Se não houver progresso calculado, retorna 0
    return 0
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <DashboardLayout title="🎯 Metas">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
            >
              Concluídas
            </button>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Nova Meta'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Adicionar Nova Meta</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Tipo de Meta *</label>
                  <select
                    required
                    value={formData.goal_type}
                    onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="weight_loss">⚖️ Perda de Peso</option>
                    <option value="muscle_gain">💪 Ganho de Massa Muscular</option>
                    <option value="body_fat">📉 Redução de Gordura Corporal</option>
                    <option value="endurance">🏃 Melhoria de Resistência</option>
                    <option value="strength">🏋️ Aumento de Força</option>
                    <option value="flexibility">🧘 Flexibilidade</option>
                    <option value="custom">🎯 Meta Personalizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    placeholder="Ex: Atingir 75kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  rows={2}
                  placeholder="Descreva sua meta..."
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-3">Metas Específicas (opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Peso Alvo (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.target_weight_kg}
                      onChange={(e) => setFormData({ ...formData, target_weight_kg: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="75.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">% Gordura Alvo</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.target_body_fat_percentage}
                      onChange={(e) => setFormData({ ...formData, target_body_fat_percentage: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="15.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Massa Muscular Alvo (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.target_muscle_mass_kg}
                      onChange={(e) => setFormData({ ...formData, target_muscle_mass_kg: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="45.0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Data de Início *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">Data Alvo</label>
                  <input
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  rows={2}
                  placeholder="Notas sobre esta meta..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Criar Meta
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 mb-2">Nenhuma meta registrada ainda.</p>
            <p className="text-sm text-gray-500">Defina suas metas e acompanhe seu progresso!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => {
              const progress = calculateProgress(goal)
              const daysRemaining = goal.target_date ? getDaysRemaining(goal.target_date) : null

              return (
                <div key={goal.id} className={`bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 ${goal.is_completed ? 'opacity-75' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{goalTypeEmoji(goal.goal_type)}</span>
                      <div>
                        <h3 className="font-semibold text-white">{goal.title}</h3>
                        <p className="text-sm text-gray-400">{goalTypeLabel(goal.goal_type)}</p>
                      </div>
                    </div>
                    {goal.is_completed && (
                      <span className="px-2 py-1 text-xs bg-green-900/20 text-green-400 rounded">✓ Concluída</span>
                    )}
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-300 mb-4">{goal.description}</p>
                  )}

                  {/* Targets */}
                  <div className="space-y-2 mb-4 text-sm">
                    {goal.target_weight_kg && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Peso Alvo:</span>
                        <span className="font-medium text-white">{goal.target_weight_kg} kg</span>
                      </div>
                    )}
                    {goal.target_body_fat_percentage && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">% Gordura Alvo:</span>
                        <span className="font-medium text-white">{goal.target_body_fat_percentage}%</span>
                      </div>
                    )}
                    {goal.target_muscle_mass_kg && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Massa Muscular Alvo:</span>
                        <span className="font-medium text-white">{goal.target_muscle_mass_kg} kg</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {!goal.is_completed && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-300">Progresso</span>
                        <span className="text-xs font-medium text-white">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Início: {new Date(goal.start_date).toLocaleDateString('pt-BR')}</p>
                    {goal.target_date && (
                      <p>
                        Prazo: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                        {daysRemaining !== null && !goal.is_completed && (
                          <span className={`ml-2 ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                            ({daysRemaining > 0 ? `${daysRemaining} dias restantes` : `${Math.abs(daysRemaining)} dias atrasado`})
                          </span>
                        )}
                      </p>
                    )}
                    {goal.completed_date && (
                      <p className="text-green-600">Concluída: {new Date(goal.completed_date).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>

                  {goal.notes && (
                    <p className="text-xs text-gray-500 italic mb-4 border-t border-gray-100 pt-2">{goal.notes}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!goal.is_completed && (
                      <button
                        onClick={() => handleComplete(goal.id)}
                        className="flex-1 px-3 py-1 text-sm text-green-400 bg-green-900/20 rounded hover:bg-green-900/30"
                      >
                        Concluir
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex-1 px-3 py-1 text-sm text-red-400 bg-red-900/20 rounded hover:bg-red-900/30"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
