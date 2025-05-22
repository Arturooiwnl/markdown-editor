import { useState, useEffect } from 'react';
import { X, User, FileText, Download, Github, Mail, Calendar } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth'

interface userProfileProps {
    isOpen: boolean
    onClose: () => void
    documentsCount: number
    downloadCount: number

}

const UserProfile = ({ isOpen, onClose, documentsCount = 0, downloadCount = 0 }: userProfileProps) => {
    const [activeTab, setActiveTab] = useState('perfil');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, []);

    if (!isOpen) return null

  return (
    <div
    style={{ position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh'}}
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100 animate-fade-in">
        <header className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-11 h-11 rounded-full " />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.providerData[0]?.displayName || user?.email?.split('@')[0]}
              </h2>
            </div>
          </div>
          <button 
            onClick={() => onClose()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </header>
  
        <nav className="border-b border-gray-800">
          <ul className="flex gap-1 px-4">
          <li>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'perfil' 
                    ? 'text-purple-400' 
                    : 'text-gray-400 cursor-pointer hover:text-gray-200'
                }`}
              >
                Perfil
                {activeTab === 'perfil' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('uso')}
                className={` px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'uso' 
                    ? 'text-purple-400' 
                    : 'text-gray-400 cursor-pointer hover:text-gray-200'
                }`}
              >
                Uso
                {activeTab === 'uso' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                )}
              </button>
            </li>
          </ul>
        </nav>
  
        <div className="p-6">
          {activeTab === 'uso' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-20">
                <div className="col-span-3 bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-gray-600" size={20} />
                    <h3 className="text-gray-200 font-medium">Documentos</h3>
                  </div>
                  <div className='flex gap-5 justify-center items-center'>
                    <p className="text-2xl font-bold text-white">{documentsCount}/5</p>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(documentsCount / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="col-span-3 bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Download className="text-gray-600" size={20} />
                    <h3 className="text-gray-200 font-medium">Descargas</h3>
                  </div>
                  <div className='flex flex-col gap-1 justify-center items-center'>
                    <p className="text-2xl font-bold text-white">{downloadCount}</p>
                    <p className='text-xl font-bold text-white'>Descargas totales</p>
                  </div>
                </div>
            </div>
              </div>
  
          )}
  
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Información del perfil</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-600" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Nombre de usuario</p>
                      <p className="text-white">{user?.providerData[0]?.displayName || user?.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-600" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Correo electrónico</p>
                      <p className="text-white">{user?.email}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <Github className="text-gray-600" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Método de inicio de sesión</p>
                      <p className="text-white">GitHub</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-600" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Miembro desde</p>
                      <p className="text-white">
                        {user?.metadata.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Detalles de la cuenta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Plan actual</span>
                    <span className="text-white font-medium">Gratuito</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Límite de documentos</span>
                    <span className="text-white font-medium">5 documentos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ID de usuario</span>
                    <span className="text-gray-300 text-sm font-mono">{user?.uid?.substring(0, 8) || 'N/A'}</span>
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;