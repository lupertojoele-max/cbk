'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Trophy
} from 'lucide-react'
import { submitContactForm } from '@/lib/api'
import { ApiError, NetworkError } from '@/lib/api'

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
  general?: string
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [state, setState] = useState<SubmissionState>('idle')
  const [announceMessage, setAnnounceMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setAnnounceMessage('Please correct the form errors.')
      return
    }

    setState('loading')
    setErrors({})
    setAnnounceMessage('Sending your message...')

    try {
      await submitContactForm(formData)
      setState('success')
      setAnnounceMessage('Message sent successfully! We\'ll get back to you soon.')

      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setState('error')

      if (error instanceof ApiError) {
        // Handle Laravel validation errors
        if (error.status === 422 && error.errors) {
          const fieldErrors: ContactFormErrors = {}
          Object.entries(error.errors).forEach(([field, messages]: [string, string[]]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field as keyof ContactFormErrors] = messages[0]
            }
          })

          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors)
            setAnnounceMessage('Please check the form for errors.')
            return
          }
        }

        // Handle rate limiting
        if (error.status === 429) {
          setErrors({ general: 'Too many requests. Please wait a moment before trying again.' })
          setAnnounceMessage('Rate limit exceeded. Please wait before trying again.')
          return
        }

        // Other API errors
        setErrors({ general: error.message })
        setAnnounceMessage(`Error: ${error.message}`)
      } else if (error instanceof NetworkError) {
        setErrors({ general: 'Network connection failed. Please check your internet connection and try again.' })
        setAnnounceMessage('Network error. Please check your connection and try again.')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
        setErrors({ general: errorMessage })
        setAnnounceMessage(`Error: ${errorMessage}`)
      }
    }
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto" id="contact-form">
      {/* ARIA Live Region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announceMessage}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-racing-gray-900">
                Send us a Message
              </CardTitle>
              <CardDescription>
                Have questions about CBK Racing? Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* General Error */}
                {errors.general && (
                  <div
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"
                    role="alert"
                    aria-describedby="general-error"
                  >
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span id="general-error" className="text-red-700">{errors.general}</span>
                  </div>
                )}

                {/* Success Message */}
                {state === 'success' && (
                  <div
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2"
                    role="alert"
                    aria-describedby="success-message"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span id="success-message" className="text-green-700">
                      Thank you for your message! We&apos;ll get back to you within 24 hours.
                    </span>
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-racing-gray-700"
                  >
                    Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={errors.name ? 'border-red-500 focus-visible:ring-red-200' : ''}
                    disabled={state === 'loading'}
                    maxLength={100}
                  />
                  {errors.name && (
                    <span id="name-error" className="text-sm text-red-600" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-racing-gray-700"
                  >
                    Email <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={errors.email ? 'border-red-500 focus-visible:ring-red-200' : ''}
                    disabled={state === 'loading'}
                    maxLength={255}
                  />
                  {errors.email && (
                    <span id="email-error" className="text-sm text-red-600" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-racing-gray-700"
                  >
                    Message <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your inquiry, feedback, or any questions you have about CBK Racing..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                    className={`min-h-32 ${errors.message ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                    disabled={state === 'loading'}
                    maxLength={1000}
                  />
                  <div className="flex justify-between">
                    {errors.message ? (
                      <span id="message-error" className="text-sm text-red-600" role="alert">
                        {errors.message}
                      </span>
                    ) : (
                      <span id="message-hint" className="text-sm text-racing-gray-500">
                        Minimum 10 characters required
                      </span>
                    )}
                    <span className="text-sm text-racing-gray-500">
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-racing-red hover:bg-racing-red/90 text-white font-semibold h-12"
                  disabled={state === 'loading'}
                  aria-describedby={state === 'loading' ? 'loading-message' : undefined}
                >
                  {state === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span id="loading-message">Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-racing-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-racing-gray-600 leading-relaxed">
              Whether you&apos;re interested in joining our team, have sponsorship opportunities,
              or just want to learn more about CBK Racing, we&apos;d love to hear from you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-6">
            <Card className="border-l-4 border-l-racing-red">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-racing-red/10 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-racing-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-racing-gray-900">Email Us</h3>
                    <p className="text-racing-gray-600">info@cbkracing.com</p>
                    <p className="text-sm text-racing-gray-500">We typically respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-racing-red">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-racing-red/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-racing-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-racing-gray-900">Call Us</h3>
                    <p className="text-racing-gray-600">+1 (555) 123-KART</p>
                    <p className="text-sm text-racing-gray-500">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-racing-red">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-racing-red/10 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-racing-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-racing-gray-900">Visit Us</h3>
                    <p className="text-racing-gray-600">CBK Racing Complex</p>
                    <p className="text-sm text-racing-gray-500">Open for tours by appointment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Facts */}
          <Card className="bg-racing-red/5 border-racing-red/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-racing-red" />
                <CardTitle className="text-lg">Why Choose CBK Racing?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-racing-red border-racing-red">
                  <Users className="w-3 h-3 mr-1" />
                  15+ Years
                </Badge>
                <span className="text-sm text-racing-gray-600">of racing experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-racing-red border-racing-red">
                  <Trophy className="w-3 h-3 mr-1" />
                  50+ Wins
                </Badge>
                <span className="text-sm text-racing-gray-600">in competitive events</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-racing-red border-racing-red">
                  <Clock className="w-3 h-3 mr-1" />
                  24/7 Support
                </Badge>
                <span className="text-sm text-racing-gray-600">for team members</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}