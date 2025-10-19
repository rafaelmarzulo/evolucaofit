'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface ProgressPhoto {
  id: number
  photo_date: string
  photo_url: string
  photo_type: 'front' | 'back' | 'side' | 'other'
  thumbnail_url?: string
  weight_at_photo_kg?: number
  notes?: string
  created_at: string
}

export default function PhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<{ before: ProgressPhoto | null; after: ProgressPhoto | null }>({
    before: null,
    after: null
  })
  const [showComparison, setShowComparison] = useState(false)
  const [formData, setFormData] = useState({
    photo_date: new Date().toISOString().split('T')[0],
    photo_type: '',
    weight_at_photo_kg: '',
    notes: '',
    file: null as File | null
  })

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/progress-photos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao buscar fotos')

      const data = await response.json()
      setPhotos(data.sort((a: ProgressPhoto, b: ProgressPhoto) =>
        new Date(b.photo_date).getTime() - new Date(a.photo_date).getTime()
      ))
    } catch (error) {
      console.error(error)
      // Se der erro de "não implementado", mostrar mensagem específica
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file) {
      alert('Por favor, selecione uma foto')
      return
    }

    const token = localStorage.getItem('token')
    const form = new FormData()
    form.append('file', formData.file)
    form.append('photo_date', formData.photo_date)
    form.append('photo_type', formData.photo_type)
    if (formData.weight_at_photo_kg) form.append('weight_at_photo_kg', formData.weight_at_photo_kg)
    if (formData.notes) form.append('notes', formData.notes)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/progress-photos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      })

      if (!response.ok) throw new Error('Erro ao fazer upload da foto')

      await fetchPhotos()
      setShowUploadForm(false)
      resetForm()
      alert('Foto enviada com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao enviar foto. Verifique se o serviço de storage (S3/MinIO) está configurado.')
    }
  }

  const resetForm = () => {
    setFormData({
      photo_date: new Date().toISOString().split('T')[0],
      photo_type: '',
      weight_at_photo_kg: '',
      notes: '',
      file: null
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/progress-photos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Erro ao excluir foto')

      await fetchPhotos()
      alert('Foto excluída com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir foto')
    }
  }

  const photoTypeLabel = (type: string) => {
    switch (type) {
      case 'front': return 'Frente'
      case 'back': return 'Costas'
      case 'side': return 'Lateral'
      case 'other': return 'Outro'
      default: return type
    }
  }

  const groupPhotosByDate = () => {
    const grouped: { [key: string]: ProgressPhoto[] } = {}
    photos.forEach(photo => {
      if (!grouped[photo.photo_date]) {
        grouped[photo.photo_date] = []
      }
      grouped[photo.photo_date].push(photo)
    })
    return grouped
  }

  const groupedPhotos = groupPhotosByDate()
  const dates = Object.keys(groupedPhotos).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const startComparison = () => {
    if (photos.length < 2) {
      alert('Você precisa de pelo menos 2 fotos para comparar')
      return
    }
    setShowComparison(true)
  }

  return (
    <DashboardLayout title="📸 Fotos de Progresso">
      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showUploadForm ? 'Cancelar' : '+ Adicionar Foto'}
          </button>

          {photos.length >= 2 && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 text-blue-400 bg-blue-900/20 border border-blue-800 rounded-md hover:bg-blue-900/30"
            >
              {showComparison ? 'Ver Galeria' : '🔍 Comparar Fotos'}
            </button>
          )}
        </div>

        {showUploadForm && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Adicionar Nova Foto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.photo_date}
                    onChange={(e) => setFormData({ ...formData, photo_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">Tipo de Foto *</label>
                  <select
                    required
                    value={formData.photo_type}
                    onChange={(e) => setFormData({ ...formData, photo_type: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="front">Frente</option>
                    <option value="back">Costas</option>
                    <option value="side">Lateral</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">Peso nesta foto (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight_at_photo_kg}
                    onChange={(e) => setFormData({ ...formData, weight_at_photo_kg: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                    placeholder="75.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Foto *</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileSelect}
                  className="mt-1 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-900/20 file:text-blue-400 hover:file:bg-blue-900/30"
                />
                {formData.file && (
                  <p className="mt-2 text-sm text-gray-300">Arquivo selecionado: {formData.file.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                  rows={2}
                  placeholder="Notas sobre esta foto..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enviar Foto
              </button>
            </form>
          </div>
        )}

        {showComparison ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Comparação de Fotos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Foto "Antes" */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Antes</h3>
                <select
                  value={selectedPhotos.before?.id || ''}
                  onChange={(e) => setSelectedPhotos({
                    ...selectedPhotos,
                    before: photos.find(p => p.id === parseInt(e.target.value)) || null
                  })}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500 mb-3"
                >
                  <option value="">Selecione uma foto...</option>
                  {photos.map(photo => (
                    <option key={photo.id} value={photo.id}>
                      {new Date(photo.photo_date).toLocaleDateString('pt-BR')} - {photoTypeLabel(photo.photo_type)}
                      {photo.weight_at_photo_kg && ` (${photo.weight_at_photo_kg}kg)`}
                    </option>
                  ))}
                </select>
                {selectedPhotos.before && (
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      {selectedPhotos.before.photo_url ? (
                        <img src={selectedPhotos.before.photo_url} alt="Foto Antes" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <p className="text-6xl mb-2">📷</p>
                          <p>Imagem não disponível</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">
                      <strong>{new Date(selectedPhotos.before.photo_date).toLocaleDateString('pt-BR')}</strong>
                      {selectedPhotos.before.weight_at_photo_kg && ` • ${selectedPhotos.before.weight_at_photo_kg}kg`}
                    </p>
                    {selectedPhotos.before.notes && (
                      <p className="text-sm text-gray-400 mt-1">{selectedPhotos.before.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Foto "Depois" */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Depois</h3>
                <select
                  value={selectedPhotos.after?.id || ''}
                  onChange={(e) => setSelectedPhotos({
                    ...selectedPhotos,
                    after: photos.find(p => p.id === parseInt(e.target.value)) || null
                  })}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500 mb-3"
                >
                  <option value="">Selecione uma foto...</option>
                  {photos.map(photo => (
                    <option key={photo.id} value={photo.id}>
                      {new Date(photo.photo_date).toLocaleDateString('pt-BR')} - {photoTypeLabel(photo.photo_type)}
                      {photo.weight_at_photo_kg && ` (${photo.weight_at_photo_kg}kg)`}
                    </option>
                  ))}
                </select>
                {selectedPhotos.after && (
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      {selectedPhotos.after.photo_url ? (
                        <img src={selectedPhotos.after.photo_url} alt="Foto Depois" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <p className="text-6xl mb-2">📷</p>
                          <p>Imagem não disponível</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">
                      <strong>{new Date(selectedPhotos.after.photo_date).toLocaleDateString('pt-BR')}</strong>
                      {selectedPhotos.after.weight_at_photo_kg && ` • ${selectedPhotos.after.weight_at_photo_kg}kg`}
                    </p>
                    {selectedPhotos.after.notes && (
                      <p className="text-sm text-gray-500 mt-1">{selectedPhotos.after.notes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedPhotos.before && selectedPhotos.after && (
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Resumo da Evolução</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-400">
                  <div>
                    <span className="font-medium">Período:</span> {
                      Math.round((new Date(selectedPhotos.after.photo_date).getTime() - new Date(selectedPhotos.before.photo_date).getTime()) / (1000 * 60 * 60 * 24))
                    } dias
                  </div>
                  {selectedPhotos.before.weight_at_photo_kg && selectedPhotos.after.weight_at_photo_kg && (
                    <div>
                      <span className="font-medium">Variação de Peso:</span> {
                        (selectedPhotos.after.weight_at_photo_kg - selectedPhotos.before.weight_at_photo_kg).toFixed(1)
                      } kg
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-400 mb-2">Nenhuma foto de progresso registrada ainda.</p>
            <p className="text-sm text-gray-500">Clique em "Adicionar Foto" para começar a documentar sua jornada!</p>
            <div className="mt-6 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-yellow-400">
                <strong>⚠️ Nota:</strong> O upload de fotos requer configuração do serviço de storage (S3/MinIO).
                Certifique-se de que o backend está configurado corretamente.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map(date => (
              <div key={date} className="bg-gray-900/50 backdrop-blur-xl rounded-lg shadow-lg shadow-black/20 border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {new Date(date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedPhotos[date].map(photo => (
                    <div key={photo.id} className="border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                        {photo.photo_url ? (
                          <img src={photo.photo_url} alt={photoTypeLabel(photo.photo_type)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <p className="text-4xl mb-1">📷</p>
                            <p className="text-xs">Imagem não disponível</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-white">{photoTypeLabel(photo.photo_type)}</p>
                        {photo.weight_at_photo_kg && (
                          <p className="text-sm text-gray-300">Peso: {photo.weight_at_photo_kg} kg</p>
                        )}
                        {photo.notes && (
                          <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">{photo.notes}</p>
                        )}
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="mt-2 w-full px-2 py-1 text-xs text-red-400 bg-red-900/20 rounded hover:bg-red-900/30"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
