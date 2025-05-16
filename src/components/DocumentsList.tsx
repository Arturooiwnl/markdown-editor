import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@clerk/astro/react';
import { Trash, Pencil, Lock, Save, X } from 'lucide-react'; // Iconos opcionales

// @ts-ignore
interface DocumentListProps {
  onEdit?: (doc: any) => void;
  markdown: string;
  disabled?: boolean;
}

function DocumentList({ onEdit, markdown, disabled = false }: DocumentListProps) {
  const supabase = useSupabase();
  const { userId } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [documentId, setDocumentId] = useState<string | null>(null)

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
        user_id: userId, 
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


  const fetchDocuments = async () => {
    if (!supabase || !userId) return;

    const { data, error } = await supabase
      // @ts-ignore
      .from('documents')
      .select('id, title, description, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener documentos:', error);
    } else {
      setDocuments(data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [supabase, userId]);

  const updateDocuments = async () => {
    if (!supabase || !userId) return;

    const { data, error } = await supabase
      // @ts-ignore
      .from('documents')
      .update({
       title,
       description,
       content: markdown,
      })
      .eq('id', documentId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al actualizar documentos:', error);
    } else {
      setDocuments(data);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!supabase) return;

    const { error } = await supabase
      // @ts-ignore
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar:', error);
    } else {
      // Actualizar la lista
      // @ts-ignore
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  return (
    <div>
      <h2 className={`${disabled ? 'hidden' : 'flex'} text-xl font-semibold mb-4`}>Tus documentos</h2>
      <ul className="documents-list space-y-4 overflow-y-scroll max-h-[200px]">
        {documents.map((doc) => (
          // @ts-ignore
          <li key={doc.id} className="bg-slate-800 p-4 rounded relative">
            <h3 className="text-lg font-bold">{(doc as { title: string }).title}</h3>
            <p className="text-sm text-gray-400">{(doc as { description: string }).description}</p>
            <p className="text-xs text-gray-500">
              Guardado el {new Date((doc as { created_at: string }).created_at).toLocaleDateString()}
            </p>

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => onEdit?.(doc)}
                className="text-blue-400 hover:text-blue-200"
                title="Editar"
              >
                <Pencil size={18} />
              </button>
              <button
                // @ts-ignore
                onClick={() => deleteDocument(doc.id)}
                className="text-red-400 hover:text-red-200"
                title="Eliminar"
              >
                <Trash size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className='mt-4'>
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
    </div>

    </div>



  );
}

export default DocumentList;
