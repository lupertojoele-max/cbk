import { Suspense } from 'react'
import { Metadata } from 'next'
import { ContactHeader } from '@/components/contact/contact-header'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactSkeleton } from '@/components/contact/contact-skeleton'

export const metadata: Metadata = {
  title: 'Contact Us | CBK Racing',
  description: 'Get in touch with CBK Racing. Send us your questions, feedback, or inquiries about our karting team and racing activities.',
  keywords: ['contact CBK Racing', 'karting team contact', 'racing team inquiries', 'motorsport contact'],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-racing-gray-50">
      {/* Header */}
      <ContactHeader />

      {/* Contact Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ContactSkeleton />}>
          <ContactForm />
        </Suspense>
      </main>
    </div>
  )
}