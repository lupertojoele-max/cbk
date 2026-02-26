/**
 * POST /api/contact
 *
 * Gestione form contatti CBK1.
 * Valida i dati con Zod, poi invia email tramite SMTP (se configurato)
 * o logga il messaggio come fallback.
 *
 * Body: { name, email, phone?, subject, message, privacy }
 * Risposta: { data: { id }, meta: null, message }
 *
 * Variabili d'ambiente richieste per email:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  successResponse,
  errorResponse,
  rateLimitExceededResponse,
  optionsResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(100, 'Nome troppo lungo'),
  email: z.string().email('Email non valida').max(200),
  phone: z
    .string()
    .regex(/^[+\d\s\-().]{7,20}$/, 'Numero di telefono non valido')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(3, 'Oggetto troppo corto')
    .max(200, 'Oggetto troppo lungo'),
  message: z
    .string()
    .min(10, 'Il messaggio deve avere almeno 10 caratteri')
    .max(5000, 'Messaggio troppo lungo'),
  privacy: z.boolean().refine((v) => v === true, {
    message: 'Devi accettare la privacy policy',
  }),
})

async function sendEmailViaSMTP(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}): Promise<void> {
  // Nodemailer è un CJS module — in produzione aggiungi: npm install nodemailer @types/nodemailer
  // e decommenta il codice qui sotto.
  //
  // const nodemailer = await import('nodemailer')
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT) || 587,
  //   secure: Number(process.env.SMTP_PORT) === 465,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // })
  // await transporter.sendMail({
  //   from: `"CBK1 Website" <${process.env.SMTP_USER}>`,
  //   to: process.env.CONTACT_EMAIL_TO || 'info@cbk1.it',
  //   replyTo: data.email,
  //   subject: `[CBK1 Contatto] ${data.subject}`,
  //   html: `
  //     <h2>Nuovo messaggio dal sito CBK1</h2>
  //     <p><strong>Nome:</strong> ${data.name}</p>
  //     <p><strong>Email:</strong> ${data.email}</p>
  //     ${data.phone ? `<p><strong>Telefono:</strong> ${data.phone}</p>` : ''}
  //     <p><strong>Oggetto:</strong> ${data.subject}</p>
  //     <hr/>
  //     <p><strong>Messaggio:</strong></p>
  //     <p>${data.message.replace(/\n/g, '<br/>')}</p>
  //   `,
  // })

  // Fallback: log del messaggio (utile in sviluppo)
  console.log('[CONTACT FORM]', {
    timestamp: new Date().toISOString(),
    ...data,
  })
}

export async function OPTIONS() {
  return optionsResponse()
}

export async function POST(request: NextRequest) {
  // Rate limiting più restrittivo per il form contatti: 5 req/10min per IP
  const ip = getClientIp(request)
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!rl.success) {
    return rateLimitExceededResponse(rl.reset)
  }
  const rlHeaders = addRateLimitHeaders({}, rl)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Body JSON non valido', 400, null, rlHeaders)
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(
      'Dati del form non validi',
      422,
      parsed.error.flatten().fieldErrors,
      rlHeaders
    )
  }

  const { name, email, phone, subject, message } = parsed.data

  try {
    await sendEmailViaSMTP({ name, email, phone: phone || undefined, subject, message })
  } catch (err) {
    console.error('[CONTACT] Errore invio email:', err)
    return errorResponse(
      'Errore interno durante l\'invio del messaggio. Riprova o contattaci direttamente.',
      500,
      null,
      rlHeaders
    )
  }

  // ID univoco del messaggio per tracciabilità
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return successResponse(
    { id: messageId },
    null,
    201,
    rlHeaders
  )
}
