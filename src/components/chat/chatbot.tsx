'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ciao! Sono l\'assistente virtuale di CBK Racing. Come posso aiutarti?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '...',
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            sender: msg.sender,
            text: msg.text,
          })),
        }),
      })

      const data = await response.json()

      // Remove typing indicator and add AI response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== 'typing')
        const botMessage: Message = {
          id: Date.now().toString(),
          text: data.message || 'Mi dispiace, si è verificato un errore. Riprova tra poco.',
          sender: 'bot',
          timestamp: new Date(),
        }
        return [...filtered, botMessage]
      })
    } catch (error) {
      console.error('Error sending message:', error)

      // Remove typing indicator and show error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== 'typing')
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: 'Mi dispiace, si è verificato un errore di connessione. Riprova tra poco o contattaci direttamente.',
          sender: 'bot',
          timestamp: new Date(),
        }
        return [...filtered, errorMessage]
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'h-14 w-14 rounded-full',
              'bg-[#1877F2] hover:bg-[#0d5dbf]',
              'text-white shadow-lg hover:shadow-xl',
              'flex items-center justify-center',
              'transition-all duration-300',
              'hover:scale-110'
            )}
            aria-label="Apri chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'w-full max-w-[400px] sm:w-[400px]',
              'bg-white dark:bg-slate-900',
              'rounded-2xl shadow-2xl',
              'flex flex-col overflow-hidden',
              'border border-slate-200 dark:border-slate-700'
            )}
            style={{ maxHeight: isMinimized ? 'auto' : '600px' }}
          >
            {/* Header */}
            <div className="bg-[#1877F2] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">CBK Racing</h3>
                  <p className="text-xs text-white/80">Di solito risponde in pochi minuti</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Espandi chat' : 'Minimizza chat'}
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label="Chiudi chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          message.sender === 'user'
                            ? 'bg-[#1877F2] text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-700 text-racing-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={cn(
                            'text-xs mt-1',
                            message.sender === 'user'
                              ? 'text-white/70'
                              : 'text-racing-gray-500 dark:text-slate-400'
                          )}
                        >
                          {message.timestamp.toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Scrivi un messaggio..."
                      className={cn(
                        'flex-1 px-4 py-2 rounded-full',
                        'bg-slate-100 dark:bg-slate-800',
                        'text-racing-gray-900 dark:text-white',
                        'placeholder:text-racing-gray-500 dark:placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-[#1877F2]',
                        'transition-colors text-sm'
                      )}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className={cn(
                        'h-10 w-10 rounded-full',
                        'bg-[#1877F2] hover:bg-[#0d5dbf]',
                        'disabled:bg-slate-300 dark:disabled:bg-slate-700',
                        'text-white flex items-center justify-center',
                        'transition-colors',
                        'disabled:cursor-not-allowed'
                      )}
                      aria-label="Invia messaggio"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-racing-gray-500 dark:text-slate-400 mt-2 text-center">
                    Premi Enter per inviare
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
