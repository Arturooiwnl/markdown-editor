import { useEffect } from 'react'
import { X, Info, AlertCircle, CheckCircle2, CircleX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'bottom-right' 
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const positionClasses = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5'
  }

  const typeStyles = {
    success: 'bg-emerald-500/40 text-white border border-emerald-400/50 shadow-lg backdrop-blur-sm',
    error: 'bg-red-500/40 text-white border border-red-400/50 shadow-lg backdrop-blur-sm',
    warning: 'bg-amber-500/40 text-white border border-amber-400/50 shadow-lg backdrop-blur-sm',
    info: 'bg-blue-500/40 text-white border border-blue-400/50 shadow-lg backdrop-blur-sm'
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-300" />
      case 'error':
        return <CircleX size={20} className="text-red-300" />
      case 'warning':
        return <AlertCircle size={20} className="text-amber-300" />
      case 'info':
        return <Info size={20} className="text-blue-300" />
      default:
        return null
    }
  }

  return (
    <div 
      className="fixed z-[100]"
      style={{ position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh'}}
    >
      <div
        className={cn(
          'absolute z-50 flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg animate-slide-up-fade',
          positionClasses[position],
          typeStyles[type]
        )}
        role="alert"
      >
        {getIcon()}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors ml-1"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast