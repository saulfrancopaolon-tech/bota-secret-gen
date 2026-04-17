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
  History,
  Trash2
} from "lucide-react"

export default function BotaGeneratorPro() {
  const [quantity, setQuantity] = useState(1)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // URL DE TU GOOGLE APPS SCRIPT
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf8QjtB996ZjFQEpAkR6au-AmakyMEV4SDzEPefW5KGY7beCQd_CpigmgTD6S-w7qCwA/exec"

  const generateCodes = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(10)
    }

    const newCodes = Array.from({ length: quantity }).map(() => {
      const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
      return `BOTA-${randomStr}`
    })
    
    setGeneratedCodes(newCodes)
    setStatus('idle')
    setCopiedAll(false)
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
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(5)
    }
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllToClipboard = () => {
    const allCodes = generatedCodes.join('\n')
    navigator.clipboard.writeText(allCodes)
    setCopiedAll(true)
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate([10, 50, 10])
    }
    setTimeout(() => setCopiedAll(false), 3000)
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 flex flex-col antialiased">
      
      <div className="h-12 w-full bg-black sticky top-0 z-50" />

      <header className="px-6 py-5 flex items-center justify-between sticky top-12 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(234,88,12,0.4)]">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Bota-Gen</h1>
            <p className="text-[9px] font-bold text-zinc-500 tracking-[0.2em] uppercase mt-1">Control de Emisiones</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-500 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
        </div>
      </header>

      <div className="flex-1 px-6 pt-8 pb-32 space-y-10 overflow-y-auto">
        
        {/* Selector de Cantidad */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Volumen de emisión</label>
          <div className="flex items-center justify-between bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-2 h-24">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-20 h-full flex items-center justify-center rounded-full bg-zinc-800/80 active:scale-90 transition-transform">
              <Minus className="h-7 w-7 text-white" />
            </button>
            <input type="number" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-5xl font-black text-center w-24 outline-none border-none focus:ring-0" />
            <button onClick={() => setQuantity(Math.min(99, quantity + 1))} className="w-20 h-full flex items-center justify-center rounded-full bg-zinc-800/80 active:scale-90 transition-transform">
              <Plus className="h-7 w-7 text-white" />
            </button>
          </div>
        </section>

        {/* Acciones */}
        <div className="grid gap-4">
          <button onClick={generateCodes} className="w-full bg-white text-black h-20 rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_15px_40px_rgba(255,255,255,0.15)] active:scale-[0.96] transition-all flex items-center justify-center gap-3">
            Generar código <ChevronRight className="h-5 w-5" />
          </button>
          
          <button onClick={saveToSheet} disabled={generatedCodes.length === 0 || isSaving} className={`w-full h-20 rounded-3xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 border-2 ${status === 'success' ? 'bg-green-600 border-green-400 text-white' : generatedCodes.length > 0 ? 'bg-transparent border-orange-600/60 text-orange-500' : 'bg-transparent border-white/5 text-zinc-800'}`}>
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : status === 'success' ? <><Check className="h-6 w-6" /> Sincronizado</> : <><Database className="h-6 w-6" /> Sincronizar Excel</>}
          </button>
        </div>

        {/* Lista de Fichas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] flex items-center gap-2">
              <History className="h-4 w-4" /> Códigos Generados
            </h3>
            <div className="flex gap-2">
              {generatedCodes.length > 1 && (
                <button 
                  onClick={copyAllToClipboard} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border ${copiedAll ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 active:bg-orange-500 active:text-white'}`}
                >
                  {copiedAll ? <><Check className="h-3 w-3" /> Copiados</> : <><Copy className="h-3 w-3" /> Copiar Todo</>}
                </button>
              )}
              {generatedCodes.length > 0 && (
                 <button onClick={() => setGeneratedCodes([])} className="p-2 text-zinc-600 active:text-red-500">
                   <Trash2 className="h-4 w-4" />
                 </button>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {generatedCodes.map((code, i) => (
                <motion.div key={code + i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => copyToClipboard(code, i)} className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all active:scale-[0.95] ${copiedIndex === i ? 'bg-orange-600/10 border-orange-500 shadow-[0_0_30px_rgba(234,88,12,0.1)]' : 'bg-zinc-900/30 border-white/5'}`}>
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-black text-zinc-600 uppercase tracking-widest">Ficha individual</span>
                    <span className="font-mono text-2xl font-bold tracking-[0.2em] text-zinc-100">{code}</span>
                  </div>
                  <div className={`p-4 rounded-2xl transition-all ${copiedIndex === i ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {copiedIndex === i ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {generatedCodes.length === 0 && (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center gap-4">
                <div className="p-4 bg-zinc-900/50 rounded-full text-zinc-700">
                  <Zap className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">Sin fichas activas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="p-10 text-center pointer-events-none pb-12">
        <p className="text-[9px] font-black uppercase tracking-[1em] text-white/20">Bota-Na Industrial © 2026</p>
      </footer>
    </main>
  )
}
