'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface Meal {
  id: number
  meal_date: string
  meal_time?: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  meal_name?: string
  description?: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  fiber_g?: number
  water_ml?: number
  notes?: string
  created_at: string
}

export default function NutritionPage() {
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [formData, setFormData] = useState({
    meal_date: new Date().toISOString().split('T')[0],
    meal_time: '',
    meal_type: '',
    meal_name: '',
    description: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fats_g: '',
    fiber_g: '',
    water_ml: '',
    notes: '',
  })

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/meals/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar refeições')

      const data = await response.json()
      setMeals(data.sort((a: Meal, b: Meal) =>
        new Date(b.meal_date).getTime() - new Date(a.meal_date).getTime()
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
      meal_date: formData.meal_date,
      meal_type: formData.meal_type,
    }

    if (formData.meal_time) payload.meal_time = formData.meal_time
    if (formData.meal_name) payload.meal_name = formData.meal_name
    if (formData.description) payload.description = formData.description
    if (formData.calories) payload.calories = parseInt(formData.calories)
    if (formData.protein_g) payload.protein_g = parseFloat(formData.protein_g)
    if (formData.carbs_g) payload.carbs_g = parseFloat(formData.carbs_g)
    if (formData.fats_g) payload.fats_g = parseFloat(formData.fats_g)
    if (formData.fiber_g) payload.fiber_g = parseFloat(formData.fiber_g)
    if (formData.water_ml) payload.water_ml = parseInt(formData.water_ml)
    if (formData.notes) payload.notes = formData.notes

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/meals/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao criar refeição')

      await fetchMeals()
      setShowForm(false)
      resetForm()
      alert('Refeição salva com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar refeição')
    }
  }

  const resetForm = () => {
    setFormData({
      meal_date: new Date().toISOString().split('T')[0],
      meal_time: '',
      meal_type: '',
      meal_name: '',
      description: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fats_g: '',
      fiber_g: '',
      water_ml: '',
      notes: '',
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta refeição?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/meals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao excluir refeição')

      await fetchMeals()
      alert('Refeição excluída com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir refeição')
    }
  }

  const mealTypeEmoji = (type: string) => {
    switch (type) {
      case 'breakfast': return '🍳'
      case 'lunch': return '🍽️'
      case 'dinner': return '🍴'
      case 'snack': return '🍎'
      default: return '🥗'
    }
  }

  const mealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Café da Manhã'
      case 'lunch': return 'Almoço'
      case 'dinner': return 'Jantar'
      case 'snack': return 'Lanche'
      default: return type
    }
  }

  const getDailySummary = (date: string) => {
    const dailyMeals = meals.filter(m => m.meal_date === date)
    return {
      totalCalories: dailyMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
      totalProtein: dailyMeals.reduce((sum, m) => sum + (m.protein_g || 0), 0),
      totalCarbs: dailyMeals.reduce((sum, m) => sum + (m.carbs_g || 0), 0),
      totalFats: dailyMeals.reduce((sum, m) => sum + (m.fats_g || 0), 0),
      totalWater: dailyMeals.reduce((sum, m) => sum + (m.water_ml || 0), 0),
      count: dailyMeals.length
    }
  }

  const uniqueDates = Array.from(new Set(meals.map(m => m.meal_date))).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <DashboardLayout title="🥗 Nutrição">
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Nova Refeição'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Adicionar Nova Refeição</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Básicos */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Dados da Refeição</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Data *</label>
                    <input
                      type="date"
                      required
                      value={formData.meal_date}
                      onChange={(e) => setFormData({ ...formData, meal_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Horário</label>
                    <input
                      type="time"
                      value={formData.meal_time}
                      onChange={(e) => setFormData({ ...formData, meal_time: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Tipo de Refeição *</label>
                    <select
                      required
                      value={formData.meal_type}
                      onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="breakfast">🍳 Café da Manhã</option>
                      <option value="lunch">🍽️ Almoço</option>
                      <option value="dinner">🍴 Jantar</option>
                      <option value="snack">🍎 Lanche</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Nome da Refeição</label>
                    <input
                      type="text"
                      value={formData.meal_name}
                      onChange={(e) => setFormData({ ...formData, meal_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="Ex: Frango com batata doce"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-200">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    rows={2}
                    placeholder="Descrição dos alimentos..."
                  />
                </div>
              </div>

              {/* Macronutrientes */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Informações Nutricionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Calorias (kcal)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Proteína (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.protein_g}
                      onChange={(e) => setFormData({ ...formData, protein_g: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="30.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Carboidratos (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.carbs_g}
                      onChange={(e) => setFormData({ ...formData, carbs_g: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="50.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Gorduras (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.fats_g}
                      onChange={(e) => setFormData({ ...formData, fats_g: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="15.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Fibras (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.fiber_g}
                      onChange={(e) => setFormData({ ...formData, fiber_g: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="5.0"
                    />
                  </div>
                </div>
              </div>

              {/* Hidratação */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Hidratação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Água (ml)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.water_ml}
                      onChange={(e) => setFormData({ ...formData, water_ml: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="500"
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
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  rows={2}
                  placeholder="Notas adicionais..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Salvar Refeição
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-12 text-center">
            <p className="text-gray-400">Nenhuma refeição registrada ainda.</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Nova Refeição" para começar!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {uniqueDates.map(date => {
              const dailyMeals = meals.filter(m => m.meal_date === date)
              const summary = getDailySummary(date)

              return (
                <div key={date} className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {new Date(date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <p className="text-sm text-gray-400">{summary.count} refeições registradas</p>
                    </div>

                    {/* Daily Summary */}
                    {summary.totalCalories > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="bg-red-900/20 rounded px-3 py-2">
                          <p className="text-xs text-red-400">Calorias</p>
                          <p className="text-lg font-semibold text-red-400">{summary.totalCalories}</p>
                        </div>
                        {summary.totalProtein > 0 && (
                          <div className="bg-blue-900/20 rounded px-3 py-2">
                            <p className="text-xs text-blue-400">Proteína</p>
                            <p className="text-lg font-semibold text-blue-400">{summary.totalProtein.toFixed(1)}g</p>
                          </div>
                        )}
                        {summary.totalCarbs > 0 && (
                          <div className="bg-yellow-900/20 rounded px-3 py-2">
                            <p className="text-xs text-yellow-400">Carboidratos</p>
                            <p className="text-lg font-semibold text-yellow-400">{summary.totalCarbs.toFixed(1)}g</p>
                          </div>
                        )}
                        {summary.totalFats > 0 && (
                          <div className="bg-red-900/20 rounded px-3 py-2">
                            <p className="text-xs text-red-400">Gorduras</p>
                            <p className="text-lg font-semibold text-red-400">{summary.totalFats.toFixed(1)}g</p>
                          </div>
                        )}
                        {summary.totalWater > 0 && (
                          <div className="bg-blue-900/20 rounded px-3 py-2">
                            <p className="text-xs text-blue-400">Água</p>
                            <p className="text-lg font-semibold text-blue-400">{summary.totalWater}ml</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {dailyMeals.map(meal => (
                      <div key={meal.id} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{mealTypeEmoji(meal.meal_type)}</span>
                              <div>
                                <h4 className="font-semibold text-white">
                                  {meal.meal_name || mealTypeName(meal.meal_type)}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {mealTypeName(meal.meal_type)}
                                  {meal.meal_time && ` • ${meal.meal_time}`}
                                </p>
                              </div>
                            </div>

                            {meal.description && (
                              <p className="text-sm text-gray-300 mt-2">{meal.description}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3 text-sm">
                              {meal.calories && (
                                <div>
                                  <span className="text-gray-300">Calorias:</span>
                                  <span className="ml-1 font-medium text-white">{meal.calories} kcal</span>
                                </div>
                              )}
                              {meal.protein_g && (
                                <div>
                                  <span className="text-gray-300">Proteína:</span>
                                  <span className="ml-1 font-medium text-white">{meal.protein_g}g</span>
                                </div>
                              )}
                              {meal.carbs_g && (
                                <div>
                                  <span className="text-gray-300">Carb:</span>
                                  <span className="ml-1 font-medium text-white">{meal.carbs_g}g</span>
                                </div>
                              )}
                              {meal.fats_g && (
                                <div>
                                  <span className="text-gray-300">Gordura:</span>
                                  <span className="ml-1 font-medium text-white">{meal.fats_g}g</span>
                                </div>
                              )}
                              {meal.water_ml && (
                                <div>
                                  <span className="text-gray-300">Água:</span>
                                  <span className="ml-1 font-medium text-white">{meal.water_ml}ml</span>
                                </div>
                              )}
                            </div>

                            {meal.notes && (
                              <p className="text-sm text-gray-400 italic mt-2">{meal.notes}</p>
                            )}
                          </div>

                          <button
                            onClick={() => handleDelete(meal.id)}
                            className="px-3 py-1 text-sm text-red-400 bg-red-900/20 rounded hover:bg-red-900/30"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
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
