'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface Exercise {
  id?: number
  exercise_name: string
  exercise_type?: 'compound' | 'isolation' | 'cardio'
  sets?: number
  reps?: number
  weight_kg?: number
  rest_seconds?: number
  distance_km?: number
  duration_minutes?: number
  order_index: number
  notes?: string
}

interface Workout {
  id: number
  workout_date: string
  workout_type: string
  duration_minutes?: number
  calories_burned?: number
  intensity?: 'low' | 'medium' | 'high'
  feeling?: 'great' | 'good' | 'ok' | 'tired' | 'exhausted'
  notes?: string
  exercises: Exercise[]
  created_at: string
}

export default function WorkoutsPage() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [formData, setFormData] = useState({
    workout_date: new Date().toISOString().split('T')[0],
    workout_type: '',
    duration_minutes: '',
    calories_burned: '',
    intensity: '',
    feeling: '',
    notes: '',
  })
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/workouts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar treinos')

      const data = await response.json()
      setWorkouts(data.sort((a: Workout, b: Workout) =>
        new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime()
      ))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addExercise = () => {
    setExercises([...exercises, {
      exercise_name: '',
      exercise_type: undefined,
      sets: undefined,
      reps: undefined,
      weight_kg: undefined,
      order_index: exercises.length,
      notes: ''
    }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const payload: any = {
      workout_date: formData.workout_date,
      workout_type: formData.workout_type,
      exercises: exercises.map(ex => ({
        exercise_name: ex.exercise_name,
        exercise_type: ex.exercise_type || undefined,
        sets: ex.sets ? parseInt(ex.sets.toString()) : undefined,
        reps: ex.reps ? parseInt(ex.reps.toString()) : undefined,
        weight_kg: ex.weight_kg ? parseFloat(ex.weight_kg.toString()) : undefined,
        rest_seconds: ex.rest_seconds ? parseInt(ex.rest_seconds.toString()) : undefined,
        distance_km: ex.distance_km ? parseFloat(ex.distance_km.toString()) : undefined,
        duration_minutes: ex.duration_minutes ? parseInt(ex.duration_minutes.toString()) : undefined,
        order_index: ex.order_index,
        notes: ex.notes || undefined
      }))
    }

    if (formData.duration_minutes) payload.duration_minutes = parseInt(formData.duration_minutes)
    if (formData.calories_burned) payload.calories_burned = parseInt(formData.calories_burned)
    if (formData.intensity) payload.intensity = formData.intensity
    if (formData.feeling) payload.feeling = formData.feeling
    if (formData.notes) payload.notes = formData.notes

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/workouts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao criar treino')

      await fetchWorkouts()
      setShowForm(false)
      resetForm()
      alert('Treino salvo com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar treino')
    }
  }

  const resetForm = () => {
    setFormData({
      workout_date: new Date().toISOString().split('T')[0],
      workout_type: '',
      duration_minutes: '',
      calories_burned: '',
      intensity: '',
      feeling: '',
      notes: '',
    })
    setExercises([])
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este treino?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao excluir treino')

      await fetchWorkouts()
      alert('Treino excluído com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir treino')
    }
  }

  const viewDetails = (workout: Workout) => {
    setSelectedWorkout(selectedWorkout?.id === workout.id ? null : workout)
  }

  const intensityEmoji = (intensity?: string) => {
    switch (intensity) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🔴'
      default: return ''
    }
  }

  const feelingEmoji = (feeling?: string) => {
    switch (feeling) {
      case 'great': return '😄'
      case 'good': return '🙂'
      case 'ok': return '😐'
      case 'tired': return '😓'
      case 'exhausted': return '😫'
      default: return ''
    }
  }

  return (
    <DashboardLayout title="🏋️ Treinos">
      <div className="space-y-6">
        <div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setSelectedWorkout(null)
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Treino'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Adicionar Novo Treino</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Básicos */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Dados do Treino</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Data *</label>
                    <input
                      type="date"
                      required
                      value={formData.workout_date}
                      onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Tipo de Treino *</label>
                    <select
                      required
                      value={formData.workout_type}
                      onChange={(e) => setFormData({ ...formData, workout_type: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Musculação">Musculação</option>
                      <option value="Cardio">Cardio</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Funcional">Funcional</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Pilates">Pilates</option>
                      <option value="Crossfit">Crossfit</option>
                      <option value="Natação">Natação</option>
                      <option value="Corrida">Corrida</option>
                      <option value="Ciclismo">Ciclismo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Duração (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Calorias Queimadas</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.calories_burned}
                      onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                      placeholder="350"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Intensidade</label>
                    <select
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="low">🟢 Baixa</option>
                      <option value="medium">🟡 Média</option>
                      <option value="high">🔴 Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Como se sentiu?</label>
                    <select
                      value={formData.feeling}
                      onChange={(e) => setFormData({ ...formData, feeling: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="great">😄 Excelente</option>
                      <option value="good">🙂 Bem</option>
                      <option value="ok">😐 Ok</option>
                      <option value="tired">😓 Cansado</option>
                      <option value="exhausted">😫 Exausto</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    rows={2}
                    placeholder="Anotações sobre o treino..."
                  />
                </div>
              </div>

              {/* Exercícios */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Exercícios</h3>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    + Adicionar Exercício
                  </button>
                </div>

                {exercises.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Nenhum exercício adicionado ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="border border-gray-800 rounded-lg p-4 bg-gray-800">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-white">Exercício #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-200">Nome do Exercício *</label>
                            <input
                              type="text"
                              required
                              value={exercise.exercise_name}
                              onChange={(e) => updateExercise(index, 'exercise_name', e.target.value)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="Ex: Supino reto"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200">Tipo</label>
                            <select
                              value={exercise.exercise_type || ''}
                              onChange={(e) => updateExercise(index, 'exercise_type', e.target.value || undefined)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                            >
                              <option value="">Selecione...</option>
                              <option value="compound">Composto</option>
                              <option value="isolation">Isolamento</option>
                              <option value="cardio">Cardio</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200">Séries</label>
                            <input
                              type="number"
                              min="1"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="3"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200">Repetições</label>
                            <input
                              type="number"
                              min="1"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExercise(index, 'reps', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="12"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200">Carga (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={exercise.weight_kg || ''}
                              onChange={(e) => updateExercise(index, 'weight_kg', e.target.value ? parseFloat(e.target.value) : undefined)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="20.0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200">Descanso (seg)</label>
                            <input
                              type="number"
                              min="0"
                              value={exercise.rest_seconds || ''}
                              onChange={(e) => updateExercise(index, 'rest_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="60"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-200">Observações</label>
                            <input
                              type="text"
                              value={exercise.notes || ''}
                              onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                              placeholder="Notas sobre o exercício..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Salvar Treino
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-12 text-center">
            <p className="text-gray-400">Nenhum treino registrado ainda.</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Novo Treino" para começar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {new Date(workout.workout_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {workout.workout_type} {workout.intensity && intensityEmoji(workout.intensity)} {workout.feeling && feelingEmoji(workout.feeling)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDetails(workout)}
                      className="px-3 py-1 text-sm text-blue-400 bg-blue-900/20 rounded hover:bg-blue-900/30"
                    >
                      {selectedWorkout?.id === workout.id ? 'Ocultar' : 'Ver Detalhes'}
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="px-3 py-1 text-sm text-red-400 bg-red-900/20 rounded hover:bg-red-900/30"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {workout.duration_minutes && (
                    <div>
                      <p className="text-sm text-gray-300">Duração</p>
                      <p className="text-lg font-semibold text-white">{workout.duration_minutes} min</p>
                    </div>
                  )}
                  {workout.calories_burned && (
                    <div>
                      <p className="text-sm text-gray-300">Calorias</p>
                      <p className="text-lg font-semibold text-white">{workout.calories_burned} kcal</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Exercícios</p>
                    <p className="text-lg font-semibold text-gray-900">{workout.exercises.length}</p>
                  </div>
                </div>

                {selectedWorkout?.id === workout.id && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    {workout.exercises.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-white mb-4">Exercícios Realizados</h4>
                        <div className="space-y-3">
                          {workout.exercises.map((exercise, idx) => (
                            <div key={exercise.id} className="bg-gray-800 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-white">
                                  {idx + 1}. {exercise.exercise_name}
                                </h5>
                                {exercise.exercise_type && (
                                  <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded">
                                    {exercise.exercise_type === 'compound' ? 'Composto' :
                                     exercise.exercise_type === 'isolation' ? 'Isolamento' : 'Cardio'}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-300">
                                {exercise.sets && <p>Séries: <span className="font-medium text-white">{exercise.sets}</span></p>}
                                {exercise.reps && <p>Reps: <span className="font-medium text-gray-900">{exercise.reps}</span></p>}
                                {exercise.weight_kg && <p>Carga: <span className="font-medium text-gray-900">{exercise.weight_kg} kg</span></p>}
                                {exercise.rest_seconds && <p>Descanso: <span className="font-medium text-gray-900">{exercise.rest_seconds}s</span></p>}
                                {exercise.distance_km && <p>Distância: <span className="font-medium text-gray-900">{exercise.distance_km} km</span></p>}
                                {exercise.duration_minutes && <p>Duração: <span className="font-medium text-gray-900">{exercise.duration_minutes} min</span></p>}
                              </div>
                              {exercise.notes && (
                                <p className="mt-2 text-sm text-gray-600 italic">{exercise.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Nenhum exercício registrado neste treino.</p>
                    )}

                    {workout.notes && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-200 mb-2">Observações do Treino</h5>
                        <p className="text-sm text-gray-300">{workout.notes}</p>
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
