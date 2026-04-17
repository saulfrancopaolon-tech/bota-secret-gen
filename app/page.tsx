"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  Plus, 
  Minus, 
  Copy, 
  Check, 
  Loader2, 
  ChevronRight,
  Database,
  History
} from "lucide-react"

export default function BotaGeneratorPro() {
  const [quantity, setQuantity] = useState(1)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf8QjtB996ZjFQEpAkR6au-AmakyMEV4SDzEPefW5KGY7beCQd_CpigmgTD6S-w7qCwA/exec" // Asegúrate de pegar tu URL

  const generateCodes = () => {
    // Respuesta táctil visual
    window.navigator.vibrate?.(10) 
    const newCodes = Array.from({ length: quantity }).map(() => {
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
      return `BOTA-${randomStr}`
    })
    setGeneratedCodes(newCodes)
    setStatus('idle')
  }

  const saveToSheet = async () => {
    if (generatedCodes.length === 0) return
    setIsSaving(true)
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "CREATE", codes: generatedCodes }),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      setStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    window.navigator.vibrate?.(5)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 overflow-hidden flex flex-col">
      
      {/* iOS Status Bar Spacer */}
      <div className="h-12 w-full bg-black sticky top-0 z-50 backdrop-blur-md bg-black/80" />

      {/* Header Estilo Apple Industrial */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-12 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.3)]">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">Bota-Gen</h1>
            <p className="text-[8px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Control de Emisiones</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
             <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Live
           </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 space-y-10">
        
        {/* Selector de Cantidad - Optimizado para pulgar */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cantidad a generar</label>
          <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-[2rem] p-2 h-20">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-800 active:scale-90 transition-transform"
            >
              <Minus className="h-6 w-6 text-white" />
            </button>
            
            <input 
              type="number" 
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="bg-transparent text-4xl font-black text-center w-20 outline-none"
            />

            <button 
              onClick={() => setQuantity(Math.min(50, quantity + 1))}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-800 active:scale-90 transition-transform"
            >
              <Plus className="h-6 w-6 text-white" />
            </button>
          </div>
        </section>

        {/* Botón de Acción Principal */}
        <div className="grid gap-4">
          <button 
            onClick={generateCodes}
            className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Preparar Fichas <ChevronRight className="h-4 w-4" />
          </button>
          
          <button 
            onClick={saveToSheet}
            disabled={generatedCodes.length === 0 || isSaving}
            className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 border
              ${status === 'success' ? 'bg-green-600 border-green-500 text-white' : 
                generatedCodes.length > 0 ? 'bg-zinc-900 border-orange-600/50 text-orange-500' : 'bg-zinc-900/30 border-white/5 text-zinc-700'}
            `}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 
             status === 'success' ? <><Check className="h-5 w-5" /> Sincronizado</> : 
             <><Database className="h-5 w-5" /> Sincronizar Excel</>}
          </button>
        </div>

        {/* Lista de Códigos - Diseño de Tarjetas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <History className="h-3 w-3" /> Fichas en cola
            </h3>
            {generatedCodes.length > 0 && (
               <button onClick={() => setGeneratedCodes([])} className="text-[10px] font-black text-red-500 uppercase">Borrar</button>
            )}
          </div>

          <AnimatePresence>
            {generatedCodes.map((code, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => copyToClipboard(code, i)}
                className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all active:scale-[0.97]
                  ${copiedIndex === i ? 'bg-orange-600/20 border-orange-600' : 'bg-zinc-900/50 border-white/5'}
                `}
              >
                <div className="space-y-1">
                  <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Código</span>
                  <span className="font-mono text-xl font-bold tracking-[0.15em]">{code}</span>
                </div>
                <div className={`p-3 rounded-xl ${copiedIndex === i ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-500'}`}>
                  {copiedIndex === i ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {generatedCodes.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Esperando generación...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Fijo con Branding */}
      <footer className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent pointer-events-none">
        <div className="text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.8em] text-white">Bota-Na Industrial</p>
        </div>
      </footer>
    </main>
  )
}
