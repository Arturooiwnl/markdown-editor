import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/astro/react'
import { useSupabase } from '@/hooks/useSupabase'
import { Save, X, Lock } from 'lucide-react'

// @ts-ignore
interface EditorSaverProps {
  markdown: string
  disabled?: boolean
}

function EditorSaver({ markdown, disabled = false }: EditorSaverProps) {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const supabase = useSupabase()
  const { userId } = useAuth()

  const saveDocument = async () => {
    if (!supabase || !userId) {
      console.error('Supabase o usuario no están listos.')
      return
    }
    // @ts-ignore
    const { error } = await supabase.from('documents').insert([
      {
        title,
        content: markdown,
        description,
        is_mdx: false,
        is_public: false,
        user_id: userId, // Clerk user ID
      }
    ])

    if (error) {
      console.error('Error al guardar:', error)
    } else {
      console.log('Guardado:', title)
      setShowModal(false)
    }
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showModal])

  return (
    <>
    <div className="relative group">
      <button 
        onClick={() => !disabled && setShowModal(true)}
        disabled={disabled}
        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all duration-300 w-full justify-center ${
          disabled 
            ? 'bg-gray-700 cursor-not-allowed opacity-75' 
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl transform hover:saturate-150'
        }`}
      >
        {disabled ? <Lock size={20} /> : <Save size={20} className="animate-pulse" />}
        <span>Guardar Documentos</span>
      </button>
      {disabled && (
        <div className="absolute -right-30 translate-x-1/2 top-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Inicia sesión para guardar documentos
        </div>
      )}
    </div>

    {showModal && !disabled && (
      <div 
        className="bg-black/60 justify-center flex items-center z-[100]" 
        style={{ position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh'}}
      >
        <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 animate-fade-in">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Guardar Documento
            </h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ingresa un título para tu documento"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Añade una descripción (opcional)"
                rows={4}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={saveDocument}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg transform hover:scale-105 transition-all duration-300 font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default EditorSaver
