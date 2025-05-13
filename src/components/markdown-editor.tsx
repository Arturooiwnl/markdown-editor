"use client"

import type React from "react"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { useDrop } from "react-dnd"
import { ItemTypes } from "@/lib/item-types"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export type FormatTextFunction = (prefix: string, suffix?: string) => void

export const MarkdownEditor = forwardRef<{ formatSelectedText: FormatTextFunction }, MarkdownEditorProps>(
  ({ value, onChange }, ref) => {
    const editorRef = useRef<HTMLTextAreaElement>(null)
    const [dropTarget, setDropTarget] = useState<{ start: number; end: number } | null>(null)
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)

    // Exponer la función formatSelectedText a los componentes padres
    useImperativeHandle(ref, () => ({
      formatSelectedText: (prefix: string, suffix: string = prefix) => {
        if (selection && editorRef.current) {
          const start = selection.start
          const end = selection.end
          const selectedText = value.substring(start, end)

          let newValue = ""
          let newSelectionStart = start + prefix.length
          let newSelectionEnd = end + prefix.length

          // Manejo especial para encabezados y citas en bloque
          if (prefix.startsWith("#") || prefix.startsWith(">")) {
            // Verificar si estamos al inicio de una línea (seleccion -1)
            const lineStart = start === 0 || value.charAt(start - 1) === "\n"

            if (lineStart) {
              // Estamos al inicio de una línea, solo agregar el prefijo
              newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
            } else {
              // Estamos en medio de una línea, agregar un salto de línea antes del prefijo
              newValue = value.substring(0, start) + "\n" + prefix + selectedText + suffix + value.substring(end)
              newSelectionStart += 1 // Considerar el salto de línea agregado
              newSelectionEnd += 1
            }
          } else {
            // Formato regular
            newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
          }

          onChange(newValue)

          // Restaurar selección con formato
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.focus()
              editorRef.current.setSelectionRange(newSelectionStart, newSelectionEnd)
              handleSelectionChange()
            }
          }, 0)
        }
      },
    }))

    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.MARKDOWN_ELEMENT,
      drop: (item: { type: string; template: string }) => {
        const cursorPosition = editorRef.current?.selectionStart || 0
        const newValue = value.substring(0, cursorPosition) + item.template + value.substring(cursorPosition)

        onChange(newValue)

        // Establecer posición del cursor después de la plantilla insertada
        setTimeout(() => {
          if (editorRef.current) {
            const newPosition = cursorPosition + item.template.length
            editorRef.current.focus()
            editorRef.current.setSelectionRange(newPosition, newPosition)
          }
        }, 0)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    })

    // Redimensionar automáticamente el área de texto
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.style.height = "auto"
        editorRef.current.style.height = `${editorRef.current.scrollHeight}px`
      }
    }, [value])

    // Manejar tecla tab para indentación
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle tab key for indentation
      if (e.key === "Tab") {
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd

        const newValue = value.substring(0, start) + "  " + value.substring(end)

        onChange(newValue)

        // Establecer posición del cursor después de las tabulaciones insertadas
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2
          }
        }, 0)
      }

      // Manejar Ctrl+B para texto en negrita
      if (e.key === "b" && e.ctrlKey) {
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd

        if (start !== end) {
          const selectedText = value.substring(start, end)
          const newValue = value.substring(0, start) + "**" + selectedText + "**" + value.substring(end)
          onChange(newValue)

          // Mantener la selección incluyendo símbolos markdown
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = start + 2
              editorRef.current.selectionEnd = end + 2
            }
          }, 0)
        }
      }

      // Manejar Ctrl+I para texto en cursiva
      if (e.key === "i" && e.ctrlKey) {
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd

        if (start !== end) {
          const selectedText = value.substring(start, end)
          const newValue = value.substring(0, start) + "*" + selectedText + "*" + value.substring(end)
          onChange(newValue)

          // Mantener la selección incluyendo símbolos markdown
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = start + 1
              editorRef.current.selectionEnd = end + 1
            }
          }, 0)
        }
      }

      // Manejar Ctrl+K para enlaces
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd

        if (start !== end) {
          const exampleUrl = "https://mneditor.arturoiwnl.pro/"
          const selectedText = value.substring(start, end)
          const newValue = value.substring(0, start) + "[" + selectedText + "](https://mneditor.arturoiwnl.pro/)" + value.substring(end)
          onChange(newValue)

          // Posicionar el cursor en la url y seleccionarla
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = start + selectedText.length + 3;
              editorRef.current.selectionEnd = start + selectedText.length + exampleUrl.length + 3;
            }
          }, 0)
        }
      }
    }

    // Rastrear cambios en la selección
    const handleSelectionChange = () => {
      if (editorRef.current) {
        const start = editorRef.current.selectionStart
        const end = editorRef.current.selectionEnd

        if (start !== end) {
          setSelection({ start, end })
        } else {
          setSelection(null)
        }
      }
    }

    return (
      <div
        // @ts-ignore
        ref={drop}
        className={cn(
          "markdown-editor-panel animate-duration-400 relative min-h-[400px] rounded-lg overflow-hidden transition-all duration-300 border-2 border-transparent",
          isOver && "border-dashed border-gray-50 bg-gray-900",
        )}
      >
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          onBlur={() => setTimeout(handleSelectionChange, 100)}
          className="w-full h-full min-h-[400px] p-6 bg-gray-900 text-white font-mono resize-none outline-none rounded-lg"
          placeholder="Escribe tu Markdown aquí..."
        />
        {isOver && (
          <div className="absolute inset-0 bg-gray-600/20 pointer-events-none flex items-center justify-center">
            <div className="bg-black/50 text-white border border-gray-300 px-4 py-2 rounded-md italic">Suelta para insertar el Elemento</div>
          </div>
        )}
      </div>
    )
  },
)

MarkdownEditor.displayName = "MarkdownEditor"
