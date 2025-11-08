import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `Sei l'assistente virtuale di CBK Racing, un negozio specializzato in prodotti e accessori per kart racing.

Informazioni su CBK Racing:
- Vendiamo pneumatici (LeCont, Vega, Maxxis, MG, Komet), telemetrie (AIM MyChron, Alfano), motori, telai, abbigliamento e accessori per il karting
- Siamo esperti nel settore e forniamo consulenza tecnica
- Offriamo assistenza pre e post vendita

Il tuo compito:
- Rispondi in modo professionale, amichevole e conciso
- Fornisci informazioni sui prodotti quando richiesto
- Suggerisci prodotti appropriati in base alle esigenze del cliente
- Se non sai qualcosa, consiglia di contattare direttamente il negozio
- Usa un tono informale ma professionale
- Rispondi sempre in italiano

Sii disponibile e cerca di aiutare il cliente a trovare il prodotto giusto per le sue esigenze.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Fallback response when no API key is configured
      return NextResponse.json({
        message: 'Grazie per il tuo messaggio! Al momento il servizio di chat AI non è configurato. Per assistenza immediata, contattaci via email o telefono. Un nostro esperto sarà felice di aiutarti con qualsiasi domanda sui nostri prodotti per il karting!',
      })
    }

    // Prepare messages for OpenAI
    const openAIMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)

      return NextResponse.json({
        message: 'Mi dispiace, si è verificato un errore. Prova a ricaricare la pagina o contattaci direttamente per assistenza.',
      })
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content

    if (!assistantMessage) {
      throw new Error('No response from AI')
    }

    return NextResponse.json({
      message: assistantMessage,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json({
      message: 'Mi dispiace, si è verificato un problema tecnico. Per assistenza immediata, contattaci via email o telefono. Saremo felici di aiutarti!',
    })
  }
}
