
import { useState, useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { MarkdownEditor, type FormatTextFunction } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { ToolbarSection } from "@/components/toolbar-section"
import { ElementLibrary } from "@/components/element-library"
import { LinkModal } from "@/components/link-modal"
import { Download, ArrowLeftSquare, ArrowDown, ChevronRight, LogInIcon, LogOutIcon, Clock, Save} from "lucide-react"
import { FileNameModal } from "@/components/file-name-modal"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useAuth } from "@clerk/astro/react"
import { cn } from "@/lib/utils"
import DocumentList from './DocumentsList';

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(`# ¡Bienvenido al Editor de Markdown!

Este es un texto en **negrita**, y este está en *cursiva*. También puedes combinar **_ambos estilos_**.

## Listas y Elementos

- 📝 Documentos
- 📊 Presentaciones
- 📱 Contenido Digital

## Imágenes

![Imagen de Fondo](https://mdeditor.arturoiwnl.pro/images/makdown-image-example.webp)

## Código

\`\`\`javascript
function saludar() {
  console.log("¡Hola, bienvenido al editor!");
}
\`\`\`

## Enlaces Útiles

[Documentación](https://markdown.es)
[GitHub](https://github.com)

## Tablas

| Función | Descripción |
|---------|-------------|
| Editar  | Modifica tu texto |
| Previsualizar | Ve el resultado |

> 💡 Tip: Puedes arrastrar y soltar elementos desde la biblioteca
`)

  const [activeTab, setActiveTab] = useState<"write" | "preview" | "split">("split")
  const [isMobile, setIsMobile] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [isFileNameModalOpen, setIsFileNameModalOpen] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<"site" | "github" | "monokai" | "dracula" | "nord">("site")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [autoSave, setAutoSave] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isEditorMode, setIsEditorMode] = useState(true)

  const { isLoaded, userId } = useAuth()

  const editorRef = useRef<{ formatSelectedText: FormatTextFunction } | null>(null)
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1000)
      if (window.innerWidth < 1000 && activeTab === "split") {
        setActiveTab("write")
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [activeTab])

  const handleOpenLinkModal = (text: string, range: { start: number; end: number }) => {
    setSelectedText(text)
    setSelectionRange(range)
    setIsLinkModalOpen(true)
  }

  const handleLinkConfirm = (url: string) => {
    if (editorRef.current && selectionRange) {
      const prefix = "["
      const suffix = `](${url})`

      const start = selectionRange.start
      const end = selectionRange.end

      const newValue = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end)

      setMarkdown(newValue)
      setIsLinkModalOpen(false)
    }
  }

  const handleDownload = () => {
    setIsFileNameModalOpen(true)
  }

  const handleDownloadConfirm = (fileName: string) => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsFileNameModalOpen(false)
  }

  const getPreviewBackground = () => {
    switch (previewTheme) {
      case "site":
        return "bg-gray-900"
      case "github":
        return "bg-[#0a0c10]"
      case "monokai":
        return "bg-[#1e1f1c]"
      case "dracula":
        return "bg-[#1a1b24]"
      case "nord":
        return "bg-[#242933]"
      default:
        return "bg-[#0a0c10]"
    }
  }

  // Cargar preferencias y contenido al iniciar
  useEffect(() => {
    if (isLoaded && userId) {
      // Cargar preferencia de autoguardado
      const savedAutoSave = localStorage.getItem(`autosave-${userId}`)
      if (savedAutoSave === 'true') {
        setAutoSave(true)
      }
  
      // Cargar contenido guardado
      const savedContent = localStorage.getItem(`markdown-content-${userId}`)
      if (savedContent) {
        setMarkdown(savedContent)
      }
    }
  }, [isLoaded, userId])
  
  // Guardar preferencia cuando cambie autoSave
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`autosave-${userId}`, autoSave.toString())
    }
  }, [autoSave, userId])
  
  // Guardar contenido al salir de la página si autoSave está activo
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId && autoSave) {
        localStorage.setItem(`markdown-content-${userId}`, markdown)
      }
    }
  
    window.addEventListener('beforeunload', handleBeforeUnload)
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [userId, autoSave, markdown])
  
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isSidebarOpen])

  return (

      <main className="relative min-h-screen text-white mt-20">
      <div 
        id="mobile-overlay" 
        className={`fixed inset-0 bg-black/50 z-10 ${!isSidebarOpen && 'hidden'}`}
        onClick={closeMobileSidebar}
      ></div>

    <aside className="fixed left-0 top-0 h-screen z-10">
    <div className="relative">
        <button
          onClick={toggleMobileSidebar}
          className="cursor-pointer fixed top-4 left-4 bg-slate-900 text-gray-300 p-2 hover:text-white transition-all duration-300 border border-slate-800 rounded-full shadow-lg group"
        >
          <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          <span className="absolute left-full ml-2 px-2 top-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Abrir barra lateral
          </span>
        </button>
      </div>

      <div 
        className={`fixed h-full w-72 ${!isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} bg-gray-900/95 backdrop-blur-md border-r border-gray-800 flex flex-col p-4 transition-all duration-300 shadow-xl`}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col justify-center items-center mt-12">
            <a 
              href="/" 
              className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeftSquare className="size-6 bg-slate-700 px-1 rounded-md" />
              <span className="font-medium">Volver al Inicio</span>
            </a>
          </div>

          <SignedIn>
            <div className="relative group">
              <button
                onClick={() => setAutoSave(!autoSave)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-2">
                  <Clock size={20} className="shrink-0" />
                  <span className="whitespace-nowrap">Auto Guardado</span>
                </div>
                <div className="w-9 h-5 bg-slate-800 rounded-full relative shrink-0">
                  <div className={`absolute top-[2px] left-[2px] bg-gray-300 w-4 h-4 rounded-full transition-all duration-300 ${
                    autoSave ? 'translate-x-4 bg-gradient-to-br from-purple-700 to-indigo-800' : ''
                  }`} />
                </div>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {autoSave ? 'Desactivar Autoguardado' : 'Activar Autoguardado'}
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="relative group">
              <button 
                disabled
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 cursor-not-allowed text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Clock size={20} className="shrink-0" />
                  <span className="whitespace-nowrap">Auto Guardado</span>
                </div>
                <div className="w-9 h-5 bg-slate-800 rounded-full relative shrink-0">
                  <div className="absolute top-[2px] left-[2px] bg-gray-600 w-4 h-4 rounded-full" />
                </div>
              </button>
              <div className="absolute -right-15 translate-x-1/2 -top-8 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Inicia sesión para activar el autoguardado
              </div>
            </div>
          </SignedOut>

          <SignedIn>
          <DocumentList markdown={markdown} onEdit={(doc) => {
          setTitle(doc.title);
          setDescription(doc.description);
          setMarkdown(doc.content); 
          }} />
        </SignedIn>
        <SignedOut>
          <DocumentList disabled markdown={markdown} onEdit={(doc) => {
          setTitle(doc.title);
          setDescription(doc.description);
          setMarkdown(doc.content); 
          }} />
        </SignedOut>

          <div className={`animate-fade-in duration-300 relative`}>
              <button
                onClick={() => document.getElementById('theme-dropdown')?.classList.toggle('hidden')}
                className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm w-full
                  border border-gray-700 hover:border-purple-500 hover:bg-gray-700
                  transition-all duration-200 cursor-pointer group"
              >
                <span className="capitalize">{previewTheme}</span>
                <ArrowDown 
                  size={16} 
                  className="transform group-hover:rotate-180 transition-transform duration-200 ml-auto"
                />
              </button>
              
              <div 
                id="theme-dropdown"
                className="hidden absolute z-[60] mt-2 w-full rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
              >
                <div className="py-1 px-2">
                  {['site', 'github', 'monokai', 'dracula', 'nord'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setPreviewTheme(theme as any);
                        document.getElementById('theme-dropdown')?.classList.add('hidden');
                      }}
                      className={`${
                        previewTheme === theme ? 'bg-gray-700 text-purple-400' : 'text-white'
                      } cursor-pointer rounded-md mb-0.5 group flex w-full items-center px-4 py-2 text-sm capitalize hover:bg-gray-700
                      transition-colors duration-150`}
                    >
                      <span className="flex-grow text-left">{theme}</span>
                      {previewTheme === theme && (
                        <span className="text-purple-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col h-full justify-end items-center space-y-4 w-full">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200 bg-gray-800 rounded-lg px-3 py-2 w-full">
                  <div className="flex gap-2 items-center">  
                    <LogInIcon className={`size-7 lg:size-5 ${isSidebarCollapsed ? 'lg:size-4' : ''}`} />
                    <span className={`inline-block ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Iniciar Sesión</span>
                  </div>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton/>
              <SignOutButton>
                <button className="cursor-pointer flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200 bg-gray-800 rounded-lg px-3 py-2 w-full">
                  <div className="flex gap-2 items-center">
                    <LogOutIcon className={`size-7 lg:size-5 rotate-180 ${isSidebarCollapsed ? 'lg:size-4' : ''}`} />
                    <span className={`inline-block ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Cerrar Sesión</span>
                  </div>
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </aside>

        <div className="container mx-auto p-4 -z-10">
          <div className="flex flex-col">
            <header className="flex items-center justify-between py-4 border-b border-gray-800 mb-2">
              <div className="mt-2 flex items-center gap-2">
                <a href="/" className="group relative">
                  <ArrowLeftSquare size={24} className="text-gray-400 hover:text-white transition-colors duration-300" />
                  <span className="hidden sm:inline absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Volver al Inicio
                  </span>
                </a>
                <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold title-gradient-text font-Audiowide">
                  Panel de Edición
                </h1>
                <p className="text-gray-400">archivo en edicion: {title || 'Ninguno'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="cursor-pointer px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
                  title="Descargar Markdown"
                >
                  <Download size={20} className="animate-pulse" />
                  <span className="hidden md:inline">Descargar</span>
                  <span className="sr-only">Descargar Markdown</span>
                </button>
                <div className="flex rounded-lg bg-gray-800/30 p-1">
                  <button
                    onClick={() => setActiveTab("write")}
                    className={`cursor-pointer text-xs sm:text-sm px-4 py-2 rounded-md transition-all duration-300 ${
                      activeTab === "write"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`cursor-pointer text-xs sm:text-sm px-4 py-2 rounded-md transition-all duration-300 ${
                      activeTab === "preview"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Vista Previa
                  </button>
                  {!isMobile && (
                    <button
                      onClick={() => setActiveTab("split")}
                      className={`cursor-pointer text-xs sm:text-sm px-4 py-2 rounded-md transition-all duration-300 ${
                        activeTab === "split"
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Ambos
                    </button>
                  )}
                </div>
              </div>
            </header>

            <DndProvider backend={HTML5Backend}>
              <div className="flex flex-col md:flex-row gap-4">
                {(activeTab === "write" || activeTab === "split") && (
                  <div className={`${activeTab === "split" ? "md:w-1/2" : "w-full"} flex flex-col gap-4`}>
                    <ToolbarSection
                      onInsert={(text) => setMarkdown((prev) => prev + text)}
                      onFormat={(prefix, suffix) => {
                        if (editorRef.current) {
                          editorRef.current.formatSelectedText(prefix, suffix)
                        }
                      }}
                      onLinkFormat={(text, range) => handleOpenLinkModal(text, range)}
                    />
                    <ElementLibrary />
                    <MarkdownEditor
                      value={markdown}
                      onChange={setMarkdown}
                      ref={(el) => {
                        if (el) {
                          editorRef.current = {
                            formatSelectedText: el.formatSelectedText,
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {(activeTab === "preview" || activeTab === "split") && (
                  <div
                    className={`${activeTab === "split" ? "-z-10 animate-fade-in animate-duration-500 md:w-1/2" : "-z-10 w-full sm:px-10"} ${getPreviewBackground()} rounded-lg p-6 overflow-auto`}
                  >
                    <MarkdownPreview markdown={markdown} codeStyle={previewTheme}/>
                  </div>
                )}
              </div>
            </DndProvider>
          </div>
        </div>

        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onConfirm={handleLinkConfirm}
          selectedText={selectedText}
        />
        <FileNameModal
          isOpen={isFileNameModalOpen}
          onClose={() => setIsFileNameModalOpen(false)}
          onConfirm={handleDownloadConfirm}
          defaultFileName="document"
        />
      </main>
  )
}
