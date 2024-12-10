'use client'

import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, Droplet } from 'lucide-react'
import { toPng } from 'html-to-image'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'HTML', 'CSS']
const paddings = [16, 32, 64, 128]

export default function CodeSnippetExporter() {
  const [code, setCode] = useState<string | undefined>('import { Detail } from "@raycast/api";\n\nexport default function Command() {\n  return <Detail markdown="Hello World" />;\n}')
  const [language, setLanguage] = useState('TSX (auto)')
  const [theme, setTheme] = useState('vs-dark')
  const [padding, setPadding] = useState(64)
  const [darkMode, setDarkMode] = useState(true)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const exportToImage = async () => {
    if (editorRef.current) {
      const editorElement = editorRef.current.getContainerDomNode()
      try {
        const dataUrl = await toPng(editorElement, { backgroundColor: darkMode ? '#1e1e1e' : '#ffffff' })
        const link = document.createElement('a')
        link.download = `code-snippet.png`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Error exporting image:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="p-6" style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}>
          <MonacoEditor
            height="200px"
            language={language.toLowerCase().replace(' ', '')}
            theme={theme}
            value={code}
            onChange={setCode}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="bg-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Droplet className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span>Background</span>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>Dark mode</span>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked)
                  setTheme(checked ? 'vs-dark' : 'vs-light')
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>Padding</span>
              {paddings.map((p) => (
                <Button
                  key={p}
                  variant={padding === p ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPadding(p)}
                  className="w-10"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={exportToImage} className="mt-4">
        Export as Image
      </Button>
    </div>
  )
}