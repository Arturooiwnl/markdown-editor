
import { useState, useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { MarkdownEditor, type FormatTextFunction } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { ToolbarSection } from "@/components/toolbar-section"
import { ElementLibrary } from "@/components/element-library"
import { LinkModal } from "@/components/link-modal"
import { Download, ArrowLeftSquare, ArrowDown } from "lucide-react"
import { FileNameModal } from "@/components/file-name-modal"

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(`# ¡Bienvenido al Editor de Markdown!

Este es un texto en **negrita**, y este está en *cursiva*. También puedes combinar **_ambos estilos_**.

## Listas y Elementos

- 📝 Documentos
- 📊 Presentaciones
- 📱 Contenido Digital

## Imágenes

![Imagen de Fondo](https://blog.facialix.com/wp-content/uploads/2023/12/curso-gratis-Markdown.jpg)

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

  const editorRef = useRef<{ formatSelectedText: FormatTextFunction } | null>(null)

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

  return (
      <main className="relative min-h-screen text-white">
        <div className="container mx-auto p-4">
          <div className="flex flex-col">
            <header className="flex items-center justify-between py-4 border-b border-gray-800 mb-2">
              <div className="mt-2 flex items-center gap-2">
                <a href="/" className="group relative">
                  <ArrowLeftSquare size={24} className="text-gray-400 hover:text-white transition-colors duration-300" />
                  <span className="hidden sm:inline absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Volver al Inicio
                  </span>
                </a>
                <h1 className="text-lg sm:text-2xl font-bold title-gradient-text font-Audiowide">
                  Panel de Edición
                </h1>
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
                {(activeTab === "preview" || activeTab === "split") && (
                  <div className="relative inline-block">
                    <button
                      onClick={() => document.getElementById('theme-dropdown')?.classList.toggle('hidden')}
                      className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm mr-2 
                        border border-gray-700 hover:border-purple-500 hover:bg-gray-700
                        transition-all duration-200 cursor-pointer group"
                    >
                      <span className="capitalize">{previewTheme}</span>
                      <ArrowDown 
                        size={16} 
                        className="transform group-hover:rotate-180 transition-transform duration-200"
                      />
                    </button>
                    
                    <div 
                      id="theme-dropdown"
                      className="hidden absolute z-50 mt-2 w-48 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                    >
                      <div className="z-20 py-1 px-2">
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
                )}
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
                    className={`${activeTab === "split" ? "-z-10 animate-duration-500 md:w-1/2" : "-z-10 w-full sm:px-10"} ${getPreviewBackground()} rounded-lg p-6 overflow-auto`}
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
