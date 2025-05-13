"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, nord, dracula, okaidia, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/lib/utils"

interface MarkdownPreviewProps {
  markdown: string
  codeStyle: string
}

const codeThemes = {
  'github': vscDarkPlus,
  'nord': nord,
  'dracula': dracula,
  'monokai': okaidia,
  'site': oneDark
}

export function MarkdownPreview({ markdown, codeStyle }: MarkdownPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const selectedTheme = codeThemes[codeStyle as keyof typeof codeThemes] || vscDarkPlus

  return (
    <div className="animate-fade-in animate-duration-500 github-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-gray-700" {...props} />
          ),
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-3 mb-1" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-bold mt-2 mb-1" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-bold mt-2 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="my-3" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-blue-400 hover:underline transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 py-1 my-3 text-gray-400" {...props} />
          ),
          // @ts-ignore
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter
                // @ts-ignore
                style={selectedTheme}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-3"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={cn("bg-gray-800 px-1.5 py-0.5 rounded text-sm", className)} {...props}>
                {children}
              </code>
            )
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700 rounded-md" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-700" {...props} />,
          tr: ({ node, ...props }) => <tr className="divide-x divide-gray-700" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-2 text-left font-medium text-gray-300" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-6 border-gray-700" {...props} />,
          img: ({ node, ...props }) => (
            <img className="max-w-full w-full h-auto rounded-md my-4" {...props} alt={props.alt || ""} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
