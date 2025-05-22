"use client"

import type React from "react"

import { useState } from "react"
import { useDrag } from "react-dnd"
import { ItemTypes } from "@/lib/item-types"
import {
  ChevronDown,
  ChevronRight,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  ImageIcon,
  Code,
  SeparatorHorizontal,
  Table,
  CheckSquare,
  FileText,
  Grip,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DraggableElementProps {
  type: string
  label: string
  icon: React.ReactNode
  template: string
}

function DraggableElement({ type, label, icon, template }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MARKDOWN_ELEMENT,
    item: { type, template },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      // @ts-ignore
      ref={drag}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-grab bg-gray-800 hover:bg-gray-700 transition-all duration-200",
        isDragging && "opacity-50",
      )}
    >
      <Grip size={14} className="text-gray-500" />
      <span className="text-gray-300">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function ElementLibrary() {
  const [isOpen, setIsOpen] = useState(true)
  const elements = [
    {
      type: "heading1",
      label: "Encabezado 1",
      icon: <Heading1 size={16} />,
      template: "\n# Encabezado 1\n\n",
    },
    {
      type: "heading2",
      label: "Encabezado 2",
      icon: <Heading2 size={16} />,
      template: "\n## Encabezado 2\n\n",
    },
    {
      type: "bulletList",
      label: "Lista con Viñetas",
      icon: <List size={16} />,
      template: "\n- Elemento 1\n- Elemento 2\n- Elemento 3\n\n",
    },
    {
      type: "numberedList",
      label: "Lista Numerada",
      icon: <ListOrdered size={16} />,
      template: "\n1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n\n",
    },
    {
      type: "taskList",
      label: "Lista de Tareas",
      icon: <CheckSquare size={16} />,
      template: "\n- [ ] Tarea 1\n- [ ] Tarea 2\n- [x] Tarea Completada\n\n",
    },
    {
      type: "codeBlock",
      label: "Bloque de Código",
      icon: <Code size={16} />,
      template: "\n```javascript\n// Tu código aquí\n```\n\n",
    },
    {
      type: "table",
      label: "Tabla",
      icon: <Table size={16} />,
      template:
        "\n| Encabezado 1 | Encabezado 2 |\n| ------------ | ------------ |\n| Celda 1      | Celda 2      |\n| Celda 3      | Celda 4      |\n\n",
    },
    {
      type: "image",
      label: "Imagén",
      icon: <ImageIcon size={16} />,
      template: "\n![Texto alternativo](https://mdeditor.arturoiwnl.pro/images/makdown-image-example.webp)\n\n",
    },
    {
      type: "separator",
      label: "Separador",
      icon: <SeparatorHorizontal size={16} />,
      template: "\n---\n\n",
    },
  ]

  return (
    <div className="animate-fade-in animate-duration-300 bg-gray-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span>Arrastra y Suelta elementos</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isOpen && (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {elements.map((element) => (
            <DraggableElement
              key={element.type}
              type={element.type}
              label={element.label}
              icon={element.icon}
              template={element.template}
            />
          ))}
        </div>
      )}
    </div>
  )
}
