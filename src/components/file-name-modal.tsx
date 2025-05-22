import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

interface FileNameModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fileName: string) => void
  defaultFileName?: string
}

export function FileNameModal({ isOpen, onClose, onConfirm, defaultFileName = "document" }: FileNameModalProps) {
  const [fileName, setFileName] = useState(defaultFileName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setFileName(defaultFileName)
      // hacer focus al input
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }
  }, [isOpen, defaultFileName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(fileName.trim() || defaultFileName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
    style={{ position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh'}}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 sm:px-0" onKeyDown={handleKeyDown}>
      <div
        className="animate-fade-in bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Descargar archivo Markdown</h3>
          <button onClick={onClose} className="cursor-pointer px-2 py-1 bg-gray-800 rounded-2xl border-gray-700 hover:bg-gray-700/90 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500">
            <X size={18} />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="file-name" className="block text-sm font-medium text-gray-300">
          Nombre del archivo
              </label>
              <div className="flex items-center">
          <input
            id="file-name"
            ref={inputRef}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="document"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="ml-2 text-gray-400">.md</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="border cursor-pointer border-gray-700 rounded px-4 py-2 hover:bg-gray-800 hover:text-white text-gray-300 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="relative cursor-pointer hover:saturate-150 inline-flex items-center justify-center px-6 py-2.5 border border-gray-500/50 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-lg transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98]"
              >
                Descargar
              </button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  )
}
