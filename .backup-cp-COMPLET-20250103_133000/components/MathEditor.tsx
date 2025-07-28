import React, { useState, useRef } from 'react'
import { X, RotateCcw, Check } from 'lucide-react'

interface MathEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  disabled?: boolean
  theme?: 'blue' | 'red' | 'orange'
}

export default function MathEditor({ 
  value, 
  onChange, 
  placeholder = "Tapez votre réponse...", 
  onSubmit,
  disabled = false,
  theme = 'blue'
}: MathEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Couleurs selon le thème
  const themeColors = {
    blue: {
      border: 'border-blue-300',
      focus: 'focus:ring-blue-500 focus:border-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
      symbolButton: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      background: 'bg-blue-50'
    },
    red: {
      border: 'border-red-300',
      focus: 'focus:ring-red-500 focus:border-red-500',
      button: 'bg-red-500 hover:bg-red-600',
      symbolButton: 'bg-red-100 hover:bg-red-200 text-red-800',
      background: 'bg-red-50'
    },
    orange: {
      border: 'border-orange-300',
      focus: 'focus:ring-orange-500 focus:border-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600',
      symbolButton: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
      background: 'bg-orange-50'
    }
  }

  const colors = themeColors[theme]

  // Symboles mathématiques essentiels
  const mathSymbols = [
    { symbol: 'x', label: 'x' },
    { symbol: 'y', label: 'y' },
    { symbol: 'a', label: 'a' },
    { symbol: 'b', label: 'b' },
    { symbol: '^', label: 'Puissance (x^n)' },
    { symbol: '²', label: 'Carré (raccourci)' },
    { symbol: '³', label: 'Cube (raccourci)' },
    { symbol: '→', label: 'Sortir puissance' },
    { symbol: '+', label: '+' },
    { symbol: '-', label: '-' },
    { symbol: '(', label: '(' },
    { symbol: ')', label: ')' },
  ]

  // Conversion des chiffres en exposants Unicode
  const toSuperscript = (char: string): string => {
    const superscriptMap: { [key: string]: string } = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾'
    }
    return superscriptMap[char] || char
  }

  // Traitement intelligent de la saisie
  const processValue = (newValue: string): string => {
    // Convertir x^123 en x¹²³
    return newValue.replace(/\^([0-9+\-()]+)/g, (match, exponent) => {
      return exponent.split('').map(toSuperscript).join('')
    })
  }

  const insertSymbol = (symbol: string) => {
    if (inputRef.current) {
      const input = inputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      
      let newValue = value.slice(0, start) + symbol + value.slice(end)
      
      // Traitement spécial pour la flèche (sortir de puissance)
      if (symbol === '→') {
        // Remplacer la flèche par un espace pour continuer la saisie
        newValue = value.slice(0, start) + ' ' + value.slice(end)
      }
      
      // Appliquer le traitement des puissances
      newValue = processValue(newValue)
      onChange(newValue)
      
      // Repositionner le curseur
      setTimeout(() => {
        input.focus()
        const newPos = symbol === '→' ? start + 1 : start + symbol.length
        input.setSelectionRange(newPos, newPos)
      }, 0)
    }
  }

  const clearInput = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
    
    // Enregistrer la position du curseur
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0)
    }
  }

  return (
    <div className={`${colors.background} rounded-lg p-3 border ${colors.border}`}>
      <div className="space-y-3">
        {/* Champ de saisie principal */}
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            id="math-editor-input"
            name="math-answer"
            value={value}
            onChange={(e) => onChange(processValue(e.target.value))}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 px-3 py-2 border ${colors.border} rounded-lg focus:outline-none focus:ring-1 ${colors.focus} font-mono text-base bg-white text-gray-900 placeholder-gray-500 !text-gray-900 !bg-white`}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          
          {/* Boutons d'action */}
          <div className="flex gap-1">
            <button
              onClick={clearInput}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-600"
              title="Effacer"
            >
              <X size={16} />
            </button>
            
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={disabled}
                className={`px-4 py-2 ${colors.button} text-white rounded transition-colors font-medium disabled:opacity-50`}
              >
                Vérifier
              </button>
            )}
          </div>
        </div>

        {/* Palette de symboles mathématiques */}
        <div className="flex flex-wrap gap-1 justify-center">
          {mathSymbols.map((item, index) => (
            <button
              key={index}
              onClick={() => insertSymbol(item.symbol)}
              className={`px-2 py-1 rounded ${colors.symbolButton} hover:shadow-sm transition-all font-mono text-sm`}
              title={`Insérer ${item.label}`}
            >
              {item.symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 