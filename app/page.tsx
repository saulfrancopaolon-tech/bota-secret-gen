"use client"

import { useState } from "react"
import { Loader2, Copy, Check, Zap, Trash2, ExternalLink } from "lucide-react"

export default function BotaGenerator() {
  const [quantity, setQuantity] = useState(1)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // ⚠️ PEGA AQUÍ TU URL DE GOOGLE APPS SCRIPT
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf8QjtB996ZjFQEpAkR6au-AmakyMEV4SDzEPefW5KGY7beCQd_CpigmgTD6S-w7qCwA/exec"

  const generateCodes = () => {
    const newCodes = Array.from({ length: quantity }).map(() => {
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
      return `BOTA-${randomStr}`
    })
    setGeneratedCodes(newCodes)
  }

  const saveToSheet = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "CREATE", codes: generatedCodes }),
      })
      const result = await res.json()
      if (result.success) alert("¡Sincronizado con el Excel! ✓")
    } catch (error) {
      alert("Error al conectar con el Excel.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#09090b', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontStyle: 'italic', fontWeight: '900', fontSize: '32px', marginBottom: '10px' }}>BOTA-GEN</h1>
        <p style={{ fontSize: '10px', color: '#52525b', letterSpacing: '2px', marginBottom: '40px' }}>SISTEMA DE EMISIÓN DE CÓDIGOS</p>

        <div style={{ backgroundColor: '#18181b', padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '10px', marginBottom: '10px', color: '#71717a' }}>CANTIDAD</label>
          <input 
            type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ width: '100%', backgroundColor: 'black', border: '1px solid #27272a', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={generateCodes} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>GENERAR</button>
            <button onClick={saveToSheet} disabled={generatedCodes.length === 0} style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: generatedCodes.length === 0 ? 0.2 : 1 }}>
              {isSaving ? "ESPERA..." : "ENVIAR EXCEL"}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {generatedCodes.map((code, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '15px', borderRadius: '12px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{code}</span>
              <button onClick={() => { navigator.clipboard.writeText(code); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 2000); }} style={{ background: 'none', border: 'none', color: copiedIndex === i ? '#22c55e' : '#52525b', cursor: 'pointer' }}>
                {copiedIndex === i ? "COPIADO" : "COPIAR"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
