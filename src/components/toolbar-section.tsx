"use client"

import type React from "react"

import {
  Bold,
  Italic,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"

interface ToolbarSectionProps {
  onInsert: (text: string) => void
  onFormat: (prefix: string, suffix?: string) => void
  onLinkFormat: (text: string, range: { start: number; end: number }) => void
}

interface ToolbarItem {
  icon: React.ReactNode
  label: string
  action: string
  shortcut?: string
  formatPrefix?: string
  formatSuffix?: string
  isFormatting?: boolean
  isLink?: boolean
}

export function ToolbarSection({ onInsert, onFormat, onLinkFormat }: ToolbarSectionProps) {
  const toolbarItems: ToolbarItem[] = [
    {
      icon: <Heading1 size={18} />,
      label: "Encabezado 1",
      action: "# Encabezado 1\n\n",
      shortcut: "# ",
      formatPrefix: "# ",
      formatSuffix: "\n",
      isFormatting: true,
    },
    {
      icon: <Heading2 size={18} />,
      label: "Encabezado 2",
      action: "## Encabezado 2\n\n",
      shortcut: "## ",
      formatPrefix: "## ",
      formatSuffix: "\n",
      isFormatting: true,
    },
    {
      icon: <Heading3 size={18} />,
      label: "Encabezado 3",
      action: "### Encabezado 3\n\n",
      shortcut: "### ",
      formatPrefix: "### ",
      formatSuffix: "\n",
      isFormatting: true,
    },
    {
      icon: <Bold size={18} />,
      label: "Negrita",
      action: "**Texto en negrita**",
      shortcut: "Ctrl+B",
      formatPrefix: "**",
      formatSuffix: "**",
      isFormatting: true,
    },
    {
      icon: <Italic size={18} />,
      label: "Cursiva",
      action: "*Texto en cursiva*",
      shortcut: "Ctrl+I",
      formatPrefix: "*",
      formatSuffix: "*",
      isFormatting: true,
    },
    {
      icon: <Link size={18} />,
      label: "Enlace",
      action: "[Texto del enlace](https://ejemplo.com)",
      shortcut: "Ctrl+K",
      isFormatting: true,
      isLink: true,
    },
    {
      icon: <Code size={18} />,
      label: "Código en línea",
      action: "`código`",
      formatPrefix: "`",
      formatSuffix: "`",
      isFormatting: true,
    },
    {
      icon: <Quote size={18} />,
      label: "Cita",
      action: "> Tu cita aquí\n\n",
      shortcut: "> ",
      formatPrefix: "> ",
      formatSuffix: "\n",
      isFormatting: true,
    }
  ]
  const handleItemClick = (item: ToolbarItem) => {
    if (item.isLink) {
      // Obtener la selección actual del documento
      const selection = document.getSelection()
      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0)
        const text = selection.toString()

        // Encontrar el elemento textarea
        const textarea = document.querySelector("textarea")
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd

          if (start !== null && end !== null && start !== end) {
            onLinkFormat(text, { start, end })
            return
          }
        }
      }

      // Si no hay texto seleccionado, insertar la plantilla
      onInsert(item.action)
    } else if (item.isFormatting && item.formatPrefix) {
      onFormat(item.formatPrefix, item.formatSuffix)
    } else {
      onInsert(item.action)
    }
  }

  return (
    <div className="animate-fade-in animate-duration-500 bg-gray-900 rounded-lg p-2 flex flex-wrap items-center justify-center gap-1">
      {toolbarItems.map((item, index) => (
      <button
        key={index}
        onClick={() => handleItemClick(item)}
        className="cursor-pointer px-2 py-1 justify-center items-center rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-400 relative group"
        title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
      >
        {item.icon}
        <span className="sr-only">{item.label}</span>
      </button>
      ))}
    </div>
  )
}
