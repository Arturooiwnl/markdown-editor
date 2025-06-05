import { useEffect, useState } from 'react';
import { addDoc, getDocs, query, where, collection, orderBy, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trash, Pencil, Lock, Save, X, Calendar, FileUp, ShieldQuestion, File, ClipboardList,User, Download, FileText, Clock, ChartBar, Settings, Github, Mail } from 'lucide-react'; 
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth'
import Toast from './Toast';
import UserProfile from './auth/UserProfile';
import { FileNameModal } from "@/components/file-name-modal"

interface DocumentListProps {
  onEdit?: (doc: any) => void;
  markdown: string;
  disabled?: boolean;
}

function DocumentList({ onEdit, markdown, disabled = false }: DocumentListProps) {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(() => {
    const savedDownloads = localStorage.getItem('totalDownloads');
    return savedDownloads ? parseInt(savedDownloads) : 0;
  });
  const [user, setUser] = useState<any>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [titleDocExists, setTitleDocExists] = useState(false)
  const [showToastSaveSuccess, setShowToastSaveSuccess] = useState(false)
  const [showToastSaveError, setShowToastSaveError] = useState(false)
  const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false)
  const [showToastDeleteError, setShowToastDeleteError] = useState(false)
  const [showToastEditInProgress, setShowToastEditInProgress] = useState(false)
  const [showToastEditSuccess, setShowToastEditSuccess] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [isFileNameModalOpen, setIsFileNameModalOpen] = useState(false)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const saveDocument = async () => {
    if (!user) return;
    
    if (totalDocuments >= 5) {
      setShowToastSaveError(true);
      return;
    }

    try {
      // Verificar si ya existe un documento con el mismo título
      const q = query(
        collection(db, "documents"),
        where("user_id", "==", user.uid),
        where("title", "==", title)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setShowToastSaveError(true);
        return;
      }

      await addDoc(collection(db, "documents"), {
        title,
        content: markdown,
        totalDownloads: totalDownloads,
        description,
        is_mdx: false,
        is_public: false,
        user_id: user.uid,
        created_at: new Date(),
      });
      console.log("Documento guardado con éxito");
      setShowModal(false);
      fetchDocuments(); // refrescar lista
    } catch (error) {
      console.error("Error al guardar el documento:", error);
    }
  };

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
    if (!user) return;
  
    try {
      const q = query(
        collection(db, "documents"),
        where("user_id", "==", user.uid),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // @ts-ignore
      setDocuments(docs);
      setTotalDocuments(docs.length); // Actualizamos el contador
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };
  

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const updateDocuments = async () => {
    if (!user || !documentId) return;
  
    try {
      const docRef = doc(db, "documents", documentId);
      await updateDoc(docRef, {
        title,
        description,
        content: markdown,
      });
      fetchDocuments(); // refrescar lista
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, "documents", id));
      // @ts-ignore
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setTotalDocuments(prev => prev - 1);
    } catch (error) {
      console.error("Error al eliminar documento:", error);
    }
  };
  
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const handleEditClick = (document: any) => {
    if (editingDocId === document.id) {
      // Si ya estamos editando este documento, actualizamos
      updateDocuments();
      setShowToastEditSuccess(true);
      setEditingDocId(null);
    } else {
      // Si no, iniciamos la edicion
      setEditingDocId(document.id);
      setDocumentId(document.id);
      setTitle(document.title);
      setDescription(document.description);
      onEdit?.(document);
      setShowToastEditInProgress(true);
    }
  };

  const checkTitleExists = async (newTitle: string) => {
    if (!user || !newTitle.trim()) return;
    
    try {
      const q = query(
        collection(db, "documents"),
        where("user_id", "==", user.uid),
        where("title", "==", newTitle)
      );
      const querySnapshot = await getDocs(q);
      setTitleDocExists(!querySnapshot.empty);
    } catch (error) {
      console.error("Error al verificar el título:", error);
    }
  };


  const handleSave = async () => {
    try {
      await saveDocument();
      setShowToastSaveSuccess(true);
      setShowModal(false);
    } catch (error) {
      setShowToastSaveError(true);
    }
  };

const handleDelete = async (id: string) => {
  try {
    await deleteDocument(id);
    setShowToastDeleteSuccess(true);
    setShowDocModal(false);
  } catch (error) {
    setShowToastDeleteError(true);
  }
};


  const handleDownload = () => {
    setIsFileNameModalOpen(true)
  }

  const handleDownloadConfirm = async (fileName: string) => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // Actualizar contador de descargas en Firebase y localStorage
    if (user && documentId) {
      try {
        const docRef = doc(db, "documents", documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const currentDownloads = docSnap.data().totalDownloads || 0;
          await updateDoc(docRef, {
            totalDownloads: currentDownloads + 1
          });
        }
      } catch (error) {
        console.error("Error al actualizar el contador de descargas:", error);
      }
    }
    
    const newTotalDownloads = totalDownloads + 1;
    setTotalDownloads(newTotalDownloads);
    localStorage.setItem('totalDownloads', newTotalDownloads.toString());
    setIsFileNameModalOpen(false);
  }

  return (

    <div>

{user ? (
            <button
              onClick={handleDownload}
              className="cursor-pointer w-full mb-7 px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-101 transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
              title="Descargar Markdown"
            >
              <Download size={20} className="animate-pulse" />
              <span className="hidden md:inline">Descargar</span>
              <span className="sr-only">Descargar Markdown</span>
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg text-gray-300 font-medium shadow-lg opacity-75 relative group"
              title="Iniciar sesión para descargar"
            >
              <Download size={20} className="opacity-50" />
              <span className="hidden md:inline">Descargar</span>
              <span className="sr-only">Descargar Markdown</span>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Inicia sesión para descargar
              </div>
            </button>
          )}

      <div className='flex items-center gap-2'>
        <h2 className={`${disabled ? 'hidden' : 'flex'} text-xl font-semibold mb-4`}>Tus documentos</h2>
        <span className='mb-3 bg-gray-600 px-1 rounded-md flex gap-1 items-center'><ClipboardList size={18}/> {totalDocuments}/5</span>
      </div>
      <ul className="documents-list space-y-4 overflow-y-scroll max-h-[200px]">
        {documents.map((doc) => (
          <li
          
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target instanceof HTMLHeadingElement || e.target instanceof HTMLParagraphElement) {
              setSelectedDoc(doc);
              setShowDocModal(true);
            }
          }}

            // @ts-ignore
            key={doc.id} 
            className="group mt-5 cursor-pointer bg-gray-900 transition-all duration-300 border border-gray-700 hover:border-gray-600 p-4 rounded-lg relative max-w-[220px] group shadow-lg"
          >
            <div 
            
            className="absolute -top-3 left-0 right-0 flex items-center px-2 py-1">
              <div className="group-hover:border-gray-600 transition-all duration-300 bg-gray-900 rounded-md px-2 py-1 text-xs font-medium text-gray-300 flex items-center gap-1 border-t border-gray-700 shadow-sm">
                <File size={12} />
                <span className="truncate text-[10px] max-w-[150px]">{(doc as { title: string }).title}</span>
              </div>
            </div>

            <div 
            onClick={(e) => {
              if (e.target === e.currentTarget || e.target instanceof HTMLHeadingElement || e.target instanceof HTMLParagraphElement) {
                setSelectedDoc(doc);
                setShowDocModal(true);
              }
            }}
            >
              <p className="text-sm mt-5 text-gray-400 line-clamp-2 break-words font-mono">{(doc as { description: string }).description}</p>
              <div className="flex justify-start items-center gap-1 text-[12px] text-gray-500">
                <Calendar size={12}/>
                {(doc as { created_at: { toDate: () => Date } }).created_at.toDate().toLocaleDateString()}
              </div>
            </div>

            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => handleEditClick(doc)}
                className={`p-1 rounded hover:bg-gray-700/50 ${
                  // @ts-ignore
                  editingDocId === doc.id ? 'text-green-400' : 'text-blue-400'
                }`}
                // @ts-ignore
                title={editingDocId === doc.id ? "Actualizar" : "Editar"}
              >
                {editingDocId === (doc as {id: string}).id ? <FileUp size={16} className="animate-pulse" /> : <Pencil size={16} />}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
                    // @ts-ignore
                    handleDelete(doc.id);
                  }
                }}
                className="p-1 rounded hover:bg-gray-700/50 text-red-400"
                title="Eliminar"
              >
                <Trash size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className='mt-4'>
      <div className="relative group">
      <button 
        onClick={() => {
          if (editingDocId) {
            handleEditClick({ id: editingDocId });
          } else {
            !disabled && setShowModal(true);
          }
        }}
        disabled={disabled || (!editingDocId && totalDocuments >= 5)}
        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all duration-300 w-full justify-center ${
          disabled || (!editingDocId && totalDocuments >= 5)
            ? 'bg-gray-700 cursor-not-allowed opacity-75' 
            : editingDocId
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:saturate-150'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl transform hover:saturate-150'
        }`}
      >
        {disabled ? <Lock size={20} /> : editingDocId ? <FileUp size={20} className="animate-pulse" /> : <Save size={20} className="animate-pulse" />}
        <span>
          {disabled 
            ? 'Inicia sesión para guardar' 
            : totalDocuments >= 5 && !editingDocId 
              ? 'Límite de documentos alcanzado' 
              : editingDocId 
                ? 'Actualizar Cambios' 
                : 'Guardar Documento'}
        </span>
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
                onChange={e => {
                  if (e.target.value.length <= 20) { 
                    setTitle(e.target.value);
                    checkTitleExists(e.target.value);
                  }
                }}
                placeholder="Ingresa un título para tu documento"
                maxLength={20} 
                className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 ${
                  title.trim() === '' || titleDocExists ? 'border-red-500' : 'border-gray-700'
                }`}
                required
              />
              <div className="flex justify-between items-center">
                {title.trim() === '' && (
                  <p className="text-red-500 text-xs">El título es obligatorio</p>
                )}
                {titleDocExists && title.trim() !== '' && (
                  <p className="text-red-500 text-xs">Ese título ya lo has usado</p>
                )}
                <span className={`text-xs ${
                  title.length >= 20 ? 'text-red-400' : 
                  title.length >= 15 ? 'text-yellow-400' : 
                  'text-gray-400'
                }`}>
                  {title.length}/20 caracteres
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={e => {
                  if (e.target.value.length <= 200) { // max 200
                    setDescription(e.target.value)
                  }
                }}
                placeholder="Añade una descripción (opcional)"
                rows={4}
                maxLength={200} // por las dudas xd
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none"
              />
              <div className="flex justify-end">
              <span className={`text-xs ${
                  description.length >= 200 ? 'text-red-400' : 
                  description.length >= 180 ? 'text-yellow-400' : 
                  'text-gray-400'
                }`}>
                  {description.length}/200 caracteres
                </span>
              </div>
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
              onClick={handleSave}
              disabled={title.trim() === '' || titleDocExists}
              className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg transform transition-all duration-300 font-medium ${
                title.trim() === '' || titleDocExists
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              }`}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>

    {selectedDoc && showDocModal && (
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
        style={{ position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh'}}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowDocModal(false);
        }}
      >
        <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl mx-4 transform transition-all duration-300 scale-100 animate-fade-in overflow-hidden">
          <header className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
            <div className='flex flex-col gap-2'>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {selectedDoc.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className='flex gap-1 items-center'><Calendar size={20}/>{selectedDoc.created_at.toDate().toLocaleDateString()}</span>
              <span className='flex gap-1 items-center'><ShieldQuestion size={20}/>{selectedDoc.is_public ? 'Público' : 'Privado'}</span>
              <span className='bg-slate-700 px-2 rounded-full'>Markdown</span>
            </div>
            </div>
            
            <button 
              onClick={() => setShowDocModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </header>
          
          <div className="content-modal-doc p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <p className="text-gray-400">{selectedDoc.description || 'Sin descripción'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Contenido</h3>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
            <button
              onClick={() => {
                handleEditClick(selectedDoc);
                setShowDocModal(false);
              }}
              className={`px-4 py-2 transition-colors rounded-lg hover:bg-gray-800 flex items-center gap-2 ${
                editingDocId === selectedDoc.id 
                  ? 'text-green-400 hover:text-green-300' 
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {editingDocId === selectedDoc.id ? (
                <>
                  <FileUp size={18} className="animate-pulse" />
                  Actualizar
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  Editar
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
                  handleDelete(selectedDoc.id);
                }
              }}
              className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-gray-800 flex items-center gap-2"
            >
              <Trash size={18} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
      <div className="absolute bottom-15 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 px-3 py-2">
      {user?.photoURL ? (
        <img 
        src={user.photoURL} 
        alt="Avatar" 
        className="cursor-pointer hover:scale-105 transition-all duration-300 w-8 h-8 rounded-full"

        onClick={() => setShowUserProfile(true)}

      />
              ) : (
                <User size={24} className="text-white" />
              )}

      </div>
      {showUserProfile && (

        <UserProfile downloadCount={totalDownloads} documentsCount={totalDocuments} isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />

      )}


        <FileNameModal
          isOpen={isFileNameModalOpen}
          onClose={() => setIsFileNameModalOpen(false)}
          onConfirm={handleDownloadConfirm}
          defaultFileName={title}
        />

     {showToastSaveSuccess && (
        <Toast
          message="¡Documento guardado exitosamente!"
          type="success"
          position='bottom-right'
          onClose={() => setShowToastSaveSuccess(false)}
        />
      )}
     {showToastSaveError && (
        <Toast
          message="¡Lo siento! No puedes guardar este documento con el mismo título."
          type="error"
          position='bottom-right'
          onClose={() => setShowToastSaveError(false)}
        />
      )}
     {showToastDeleteSuccess && (
        <Toast
          message="¡Documento eliminado exitosamente!"
          type="success"
          position='bottom-right'
          onClose={() => setShowToastDeleteSuccess(false)}
        />
      )}
     {showToastDeleteError && (
        <Toast
          message="¡Ocurrio un error al eliminar el documento!"
          type="error"
          position='bottom-right'
          onClose={() => setShowToastDeleteError(false)}
        />
      )}
     {showToastEditInProgress && (
        <Toast
          message={`¡Estas editando el documento '${title}'!`}
          type="info"
          position='bottom-right'
          onClose={() => setShowToastEditInProgress(false)}
        />
      )}
     {showToastEditSuccess && (
        <Toast
          message={`¡Edición de '${title}' completada exitosamente!`}
          type="success"
          position='bottom-right'
          onClose={() => setShowToastEditSuccess(false)}
        />
      )}

    </div>

    

  );
}

export default DocumentList;

