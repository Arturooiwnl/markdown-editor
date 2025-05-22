import { useEffect, useState } from 'react';
import { loginWithGitHub, logout, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Github,LayoutDashboardIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div >
      {!user ? (
        <>
          <button
            onClick={loginWithGitHub}
            className="cursor-pointer relative inline-flex items-center justify-center px-3 py-1 font-medium text-white transition-all duration-300 bg-[#24292e] hover:bg-[#1b1f23] rounded-lg hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-gray-500/25 gap-1"
          >
          <Github className="w-5 h-5" />
          <span className="relative flex items-center gap-2">
            Iniciar Sesión
          </span>
          </button>
        </>
      ) : (
        <>
        <div className='flex items-center gap-3'>
            <button
            onClick={logout}
            className="hover:text-white/80 text-sm cursor-pointer"
          >
            Cerrar Sesión
          </button>

          <a href="/editor" aria-label="ir al editor" className="relative inline-flex items-center justify-center px-3 py-1 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-700 hover:to-violet-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25 gap-1">
            <LayoutDashboardIcon className="w-5 h-5" />
            <span className="relative flex items-center gap-2">
              Editor
            </span>
          </a>
        </div>
        </>
      )}
    </div>
  );
}
