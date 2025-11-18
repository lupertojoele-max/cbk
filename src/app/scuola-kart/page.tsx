'use client'

import { Metadata } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Baby,
  Sparkles,
  UserCircle,
  Calendar,
  Users,
  Shield,
  Award,
  Target
} from 'lucide-react'

const courses = [
  {
    id: 'puffo',
    title: 'CORSO PUFFO',
    ageRange: '4 A 8 ANNI',
    kart: 'KART 50cc MOTORE COMER',
    image: '/images/corsi/corso-puffo.avif',
    icon: Baby,
  },
  {
    id: 'bambini',
    title: 'CORSO BAMBINI',
    ageRange: '7 A 12 ANNI',
    kart: 'KART 60cc MOTORE MINI',
    image: '/images/corsi/corso-bambini.avif',
    icon: Sparkles,
  },
  {
    id: 'adulti',
    title: 'CORSO ADULTI',
    ageRange: '14 A + ANNI',
    kart: 'KART 125cc MONOMARCIA',
    image: '/images/corsi/corso-adulti.avif',
    icon: UserCircle,
  },
]

const courseContent = [
  'Basi Di Sicurezza',
  'Prove in Pista',
  'Istruttore Dedicato',
]

const benefits = [
  {
    icon: Shield,
    title: 'Sicurezza Certificata',
    description: 'Circuiti omologati con massimi standard di sicurezza',
  },
  {
    icon: Award,
    title: 'Istruttori Professionisti',
    description: 'Team con esperienza agonistica e didattica certificata',
  },
  {
    icon: Target,
    title: 'Metodo CBK',
    description: 'Programma didattico progressivo e personalizzato',
  },
  {
    icon: Users,
    title: 'Piccoli Gruppi',
    description: 'Max 6 allievi per garantire attenzione individuale',
  },
]

export default function KartingAcademyPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    birthday: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-5" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1877F2] px-6 py-3 rounded-full mb-8 shadow-xl">
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">KARTING ACADEMY</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Scegli il corso che fa per te<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1877F2] to-cyan-400">
              e dai inizio a questa sensazione
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            Dalla prima curva al podio: formazione professionale per piloti di tutte le età
          </p>

          <a
            href="#corsi"
            className="inline-block bg-[#1877F2] text-white px-10 py-5 rounded-xl font-bold text-lg
              hover:bg-[#0d5dbf] transition-all duration-300 shadow-2xl hover:shadow-[#1877F2]/50 hover:scale-105"
          >
            Scopri i Corsi
          </a>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1877F2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Perché Scegliere CBK Racing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
            L'eccellenza al servizio della tua passione
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1877F2] to-cyan-400 rounded-t-2xl" />

                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1877F2] to-cyan-400 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="corsi" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
              I Nostri Corsi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Programmi studiati per ogni età ed esperienza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                {/* Course Image with Overlay */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                  {/* Age Range on Image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-5xl font-black text-white mb-2 leading-tight">
                      {course.ageRange}
                    </div>
                    <div className="text-2xl font-bold text-white/90">
                      {course.title}
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-8 bg-gradient-to-br from-[#1877F2] to-[#0d5dbf] text-white">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/80">
                      Veicolo
                    </h4>
                    <p className="text-xl font-bold">
                      {course.kart}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">
                      Programma del corso
                    </h4>
                    <ul className="space-y-3">
                      {courseContent.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">DOMENICA</span>
                    </div>
                    <div className="text-lg font-bold">
                      09:30 - 11:30
                    </div>
                    <div className="text-lg font-bold">
                      13:30 - 15:00
                    </div>
                  </div>

                  {(course.id === 'bambini' || course.id === 'adulti') && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-sm text-white/90 flex items-start gap-2">
                        <span className="text-yellow-300">*</span>
                        <span>NB. I piloti dovranno essere obbligatoriamente tesserati</span>
                      </p>
                    </div>
                  )}

                  <a
                    href="#contatti"
                    className="block mt-8 text-center bg-white text-[#1877F2] px-8 py-4 rounded-xl font-bold
                      hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Richiedi Informazioni
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contatti" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
                Richiedi un Preventivo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Compila il form e ti ricontatteremo al più presto
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl
                        focus:border-[#1877F2] focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-all
                        text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="Il tuo nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                      Cognome
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl
                        focus:border-[#1877F2] focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-all
                        text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl
                      focus:border-[#1877F2] focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-all
                      text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="tua@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="birthday" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Data di Nascita
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl
                      focus:border-[#1877F2] focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-all
                      text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Messaggio
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl
                      focus:border-[#1877F2] focus:bg-white dark:focus:bg-gray-600 focus:outline-none transition-all
                      text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                    placeholder="Raccontaci qualcosa di te e dei tuoi obiettivi..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1877F2] to-cyan-500 text-white px-8 py-5 rounded-xl font-bold text-lg
                    hover:from-[#0d5dbf] hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                >
                  Invia Richiesta
                </button>
              </form>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1877F2] text-white rounded-full mb-4">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Telefono</h3>
                <a href="tel:+393281234567" className="text-[#1877F2] hover:underline font-semibold">
                  +39 328 123 4567
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1877F2] text-white rounded-full mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                <a href="mailto:info@cbkracing.it" className="text-[#1877F2] hover:underline font-semibold">
                  info@cbkracing.it
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1877F2] text-white rounded-full mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Sede</h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Via+Giovanni+Amendola+27,+Varese,+VA+21100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:underline font-semibold"
                >
                  Via Giovanni Amendola 27<br />
                  Varese, VA 21100
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
