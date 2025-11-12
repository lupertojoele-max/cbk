'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, MessageSquare, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    series: string
    round?: number
    dates: string
    venue: string
    location: string
  }
}

export function EventRegistrationModal({ isOpen, onClose, event }: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare email content
      const emailContent = `
        Nuova Iscrizione Evento Karting

        EVENTO:
        - Serie: ${event.series}${event.round ? ` - Round ${event.round}` : ''}
        - Date: ${event.dates}
        - Circuito: ${event.venue}
        - Località: ${event.location}

        DATI PILOTA:
        - Nome: ${formData.name}
        - Email: ${formData.email}
        - Telefono: ${formData.phone}
        - Categoria: ${formData.category}

        MESSAGGIO:
        ${formData.message || 'Nessun messaggio aggiuntivo'}
      `

      // Send to your email endpoint (you'll need to create this)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Iscrizione ${event.series} - ${event.dates}`,
          message: emailContent,
          type: 'event-registration',
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
          onClose()
          setFormData({
            name: '',
            email: '',
            phone: '',
            category: '',
            message: '',
          })
        }, 3000)
      } else {
        alert('Errore durante l\'invio. Riprova più tardi.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Errore durante l\'invio. Riprova più tardi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-racing-gray-800 rounded-xl shadow-2xl max-w-lg w-full my-8"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <h2 className="text-xl font-bold mb-1">Iscrizione Evento</h2>
                <div className="space-y-0.5">
                  <p className="text-white/90 text-sm font-semibold">
                    {event.series}{event.round && ` - Round ${event.round}`}
                  </p>
                  <p className="text-white/80 text-xs">
                    {event.dates} • {event.venue}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="p-4">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-racing-gray-900 dark:text-white mb-1">
                      Iscrizione Inviata!
                    </h3>
                    <p className="text-sm text-racing-gray-600 dark:text-racing-gray-300">
                      Ti contatteremo presto per confermare la tua iscrizione.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 mb-1">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 text-sm border border-racing-gray-300 dark:border-racing-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-racing-gray-700 dark:text-white"
                          placeholder="Mario Rossi"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 text-sm border border-racing-gray-300 dark:border-racing-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-racing-gray-700 dark:text-white"
                          placeholder="mario.rossi@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 mb-1">
                        Telefono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 text-sm border border-racing-gray-300 dark:border-racing-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-racing-gray-700 dark:text-white"
                          placeholder="+39 123 456 7890"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 mb-1">
                        Categoria *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-racing-gray-400" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 text-sm border border-racing-gray-300 dark:border-racing-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-racing-gray-700 dark:text-white appearance-none"
                        >
                          <option value="">Seleziona categoria</option>
                          <option value="MINI">MINI</option>
                          <option value="MINI ROK">MINI ROK</option>
                          <option value="OKNJ">OKNJ</option>
                          <option value="OKN">OKN</option>
                          <option value="OKJ">OKJ</option>
                          <option value="JUNIOR ROK">JUNIOR ROK</option>
                          <option value="OK">OK</option>
                          <option value="SENIOR ROK">SENIOR ROK</option>
                          <option value="EXPERT ROK">EXPERT ROK</option>
                          <option value="KZ2">KZ2</option>
                          <option value="SUPER ROK">SUPER ROK</option>
                          <option value="SHIFTER ROK">SHIFTER ROK</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-racing-gray-700 dark:text-racing-gray-300 mb-1">
                        Messaggio (Opzionale)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-2.5 top-2.5 w-4 h-4 text-racing-gray-400" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-racing-gray-300 dark:border-racing-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-racing-gray-700 dark:text-white resize-none"
                          placeholder="Note aggiuntive o richieste speciali..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-9 text-sm"
                        disabled={isSubmitting}
                      >
                        Annulla
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            Invio...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1.5" />
                            Invia
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-racing-gray-500 dark:text-racing-gray-400 text-center mt-2">
                      I tuoi dati verranno inviati a kartingclubvarese1@gmail.com
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
