'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    // Simulate submission (frontend only)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 800)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Benvenuto nella CBK Community!</h3>
        <p className="text-gray-300">Ti invieremo le ultime novita su prodotti, offerte esclusive e setup tecnici direttamente nella tua inbox.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="La tua email da pilota..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-racing-red focus:ring-2 focus:ring-racing-red/50 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Iscrizione...' : 'Iscriviti Gratis'}
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-3 text-center">
        Nessuno spam. Solo contenuti tecnici per piloti seri. Cancellazione in un click.
      </p>
    </form>
  )
}
