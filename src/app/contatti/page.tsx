'use client'

import { useState } from 'react'
import Link from 'next/link'

type FormState = {
  nome: string
  email: string
  telefono: string
  oggetto: string
  messaggio: string
}

type Errors = Partial<Record<keyof FormState, string>>

export default function ContattiPage() {
  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    telefono: '',
    oggetto: '',
    messaggio: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.nome.trim()) e.nome = 'Il nome è obbligatorio'
    if (!form.email.trim()) e.email = "L'email è obbligatoria"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email non valida'
    if (!form.oggetto) e.oggetto = "L'oggetto è obbligatorio"
    if (!form.messaggio.trim()) e.messaggio = 'Il messaggio è obbligatorio'
    else if (form.messaggio.trim().length < 10) e.messaggio = 'Messaggio troppo breve (min 10 caratteri)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  const field = (
    id: keyof FormState,
    label: string,
    type: string = 'text',
    required = true
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {label}{required && <span className="text-racing-red ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red transition-colors ${
          errors[id] ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  )

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-3">Messaggio Inviato!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Grazie {form.nome}, ti risponderemo entro 24 ore lavorative.
          </p>
          <Link
            href="/prodotti"
            className="inline-flex items-center px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Torna al Catalogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-racing-red transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Contatti</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-14 rounded-full bg-racing-red" />
          <div>
            <p className="text-xs text-racing-red font-bold uppercase tracking-widest mb-1">Assistenza</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Contattaci
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Il team tecnico CBK1 risponde entro 24h</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field('nome', 'Nome e Cognome')}
            {field('email', 'Email', 'email')}
          </div>
          {field('telefono', 'Telefono', 'tel', false)}

          <div>
            <label htmlFor="oggetto" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Oggetto<span className="text-racing-red ml-0.5">*</span>
            </label>
            <select
              id="oggetto"
              value={form.oggetto}
              onChange={(e) => setForm((f) => ({ ...f, oggetto: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-racing-red transition-colors ${
                errors.oggetto ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleziona...</option>
              <option value="assistenza-ordine">Assistenza ordine</option>
              <option value="info-prodotto">Informazioni prodotto</option>
              <option value="reso-rimborso">Reso / Rimborso</option>
              <option value="partnership">Partnership / Sponsorship</option>
              <option value="altro">Altro</option>
            </select>
            {errors.oggetto && <p className="text-xs text-red-500 mt-1">{errors.oggetto}</p>}
          </div>

          <div>
            <label htmlFor="messaggio" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Messaggio<span className="text-racing-red ml-0.5">*</span>
            </label>
            <textarea
              id="messaggio"
              rows={5}
              value={form.messaggio}
              onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
              placeholder="Descrivi la tua richiesta..."
              className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red transition-colors resize-none ${
                errors.messaggio ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.messaggio && <p className="text-xs text-red-500 mt-1">{errors.messaggio}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-racing-red focus:ring-offset-2"
          >
            {loading ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>
        </form>
      </div>
    </div>
  )
}
