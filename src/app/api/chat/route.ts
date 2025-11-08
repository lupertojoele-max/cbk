import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Predefined responses based on keywords
const responses = {
  greeting: [
    'Ciao! Benvenuto da CBK Racing! Come posso aiutarti oggi?',
    'Ciao! Sono qui per aiutarti con i prodotti per il karting. Cosa ti interessa?',
    'Benvenuto! Posso aiutarti a trovare pneumatici, telemetrie, motori o altri accessori per il tuo kart.',
  ],
  pneumatici: [
    'Abbiamo un\'ampia gamma di pneumatici per karting! Offriamo marchi come LeCont, Vega, Maxxis, MG e Komet. Che tipo di pneumatici stai cercando? Slick per asciutto o rain per bagnato?',
    'I nostri pneumatici includono le migliori marche: LeCont, Vega, Maxxis, MG e Komet. Posso aiutarti a scegliere quelli giusti per la tua categoria e condizioni di pista.',
  ],
  telemetrie: [
    'Per le telemetrie offriamo i migliori sistemi AIM MyChron e Alfano. Questi strumenti ti permettono di monitorare temperatura, RPM, velocità e molto altro. Vuoi sapere di più su un modello specifico?',
    'Abbiamo telemetrie AIM MyChron e Alfano, perfette per migliorare le tue prestazioni in pista. Quale categoria di karting pratichi?',
  ],
  motori: [
    'Trattiamo motori per diverse categorie di karting. Che categoria ti interessa? Mini, OK, KZ o altro?',
    'Abbiamo motori per tutte le categorie. Per darti le informazioni giuste, di che categoria hai bisogno?',
  ],
  telai: [
    'I nostri telai sono selezionati tra i migliori brand del settore. Quale categoria di karting pratichi?',
    'Offriamo telai per diverse categorie. Dimmi la tua categoria e ti posso consigliare al meglio!',
  ],
  prezzi: [
    'Per informazioni dettagliate sui prezzi, ti consiglio di contattarci direttamente via email o telefono. Saremo felici di farti un preventivo personalizzato!',
    'I prezzi variano in base al prodotto e alle offerte del momento. Contattaci per un preventivo su misura!',
  ],
  contatti: [
    'Puoi contattarci via email o telefono. Trovi tutte le informazioni nella sezione Contatti del sito. Saremo felici di aiutarti!',
    'Per parlare direttamente con il nostro team, visita la sezione Contatti. Siamo sempre disponibili!',
  ],
  orari: [
    'Per conoscere i nostri orari di apertura, visita la sezione Contatti o chiamaci direttamente!',
  ],
  spedizione: [
    'Offriamo spedizioni in tutta Italia. Per dettagli su tempi e costi, contattaci direttamente!',
  ],
  assistenza: [
    'Offriamo assistenza completa pre e post vendita. Il nostro team è sempre disponibile per consigli tecnici e supporto. Contattaci per maggiori informazioni!',
  ],
  default: [
    'Interessante! Per darti le informazioni più precise, ti consiglio di contattarci direttamente. Il nostro team sarà felice di aiutarti nel dettaglio!',
    'Grazie per la domanda! Per informazioni specifiche, il modo migliore è contattarci direttamente. Possiamo aiutarti meglio conoscendo le tue esigenze precise!',
  ],
  thanks: [
    'Prego! Sono qui se hai altre domande! 😊',
    'Felice di aiutarti! Se hai altre domande, chiedi pure!',
  ],
  campionati: [
    'CBK Racing partecipa a diversi campionati nazionali e internazionali di karting. Visita la sezione Campionati del sito per vedere tutte le categorie in cui compeiamo!',
    'Siamo attivi in vari campionati! Dai un\'occhiata alla pagina Campionati per scoprire tutte le competizioni a cui partecipiamo.',
  ],
  gare: [
    'Per conoscere il calendario delle prossime gare e gli eventi in programma, visita la sezione Eventi sul nostro sito. Troverai date, circuiti e categorie!',
    'Il calendario gare è sempre aggiornato nella sezione Eventi. Vieni a trovarci in pista!',
  ],
  eventi: [
    'Organizziamo e partecipiamo a molti eventi karting! Controlla la sezione Eventi per scoprire tutte le date e i dettagli.',
    'Per tutti i nostri eventi e appuntamenti in pista, visita la pagina Eventi del sito. Ti aspettiamo!',
  ],
  team: [
    'Il team CBK Racing è composto da piloti esperti e appassionati. Visita la sezione Team per conoscere tutti i nostri piloti!',
    'Vuoi conoscere i piloti del team? Dai un\'occhiata alla pagina Team dove trovi tutti i profili!',
  ],
  risultati: [
    'Tutti i nostri risultati di gara sono pubblicati nella sezione Risultati. Seguici per scoprire come vanno le competizioni!',
    'Per vedere i risultati delle gare più recenti, visita la pagina Risultati sul sito!',
  ],
  sponsor: [
    'Collaboriamo con i migliori partner del settore! Scopri tutti i nostri sponsor nella sezione dedicata del sito.',
    'I nostri sponsor sono fondamentali per il successo del team. Visita la pagina Sponsor per conoscerli tutti!',
  ],
  news: [
    'Tutte le ultime notizie dal mondo CBK Racing sono nella sezione News. Rimani aggiornato!',
    'Per le news più recenti su gare, team e prodotti, visita la pagina News del sito!',
  ],
  abbigliamento: [
    'Offriamo abbigliamento tecnico per piloti: tute, guanti, scarpe, caschi e molto altro. Vuoi sapere di più su qualcosa in particolare?',
    'Abbiamo una vasta gamma di abbigliamento tecnico per il karting. Contattaci per trovare quello giusto per te!',
  ],
  accessori: [
    'Vendiamo tutti gli accessori essenziali per il kart: ricambi, attrezzi, lubrificanti e molto altro. Di cosa hai bisogno?',
    'Accessori per kart? Abbiamo tutto! Ricambi, tool, lubrificanti e molto altro. Contattaci per maggiori info!',
  ],
  categorie: [
    'Nel karting ci sono diverse categorie: Mini, Baby, OK, OK Junior, KZ, KZ2, Shifter e altre. Quale ti interessa?',
    'Le categorie karting sono tante! Mini, OK, KZ e altre. Dimmi la tua e ti aiuto a trovare i prodotti giusti!',
  ],
  setup: [
    'Per consigli sul setup del kart, il nostro team è sempre disponibile. Contattaci per una consulenza personalizzata!',
    'Il setup è fondamentale! Chiamaci o scrivici per una consulenza tecnica specifica per il tuo kart.',
  ],
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Greeting patterns
  if (/(ciao|salve|buongiorno|buonasera|hey|hello)/i.test(lowerMessage)) {
    return 'greeting'
  }

  // Thanks patterns
  if (/(grazie|thanks|thank you)/i.test(lowerMessage)) {
    return 'thanks'
  }

  // Product categories
  if (/(pneumatic|gomm|ruot|slick|rain|lecont|vega|maxxis|komet)/i.test(lowerMessage)) {
    return 'pneumatici'
  }

  if (/(telemetri|mychron|alfano|aim|cronometro|sensori)/i.test(lowerMessage)) {
    return 'telemetrie'
  }

  if (/(motor|engine|rok|iame|rotax)/i.test(lowerMessage)) {
    return 'motori'
  }

  if (/(telai|telaio|chassis|crg|tony|birel)/i.test(lowerMessage)) {
    return 'telai'
  }

  // Services
  if (/(prez|cost|quanto)/i.test(lowerMessage)) {
    return 'prezzi'
  }

  if (/(contat|telefon|email|chiamar|scriv)/i.test(lowerMessage)) {
    return 'contatti'
  }

  if (/(orar|aperto|chiuso|quando)/i.test(lowerMessage)) {
    return 'orari'
  }

  if (/(spediz|consegn|shipping)/i.test(lowerMessage)) {
    return 'spedizione'
  }

  if (/(assisten|aiuto|support|help)/i.test(lowerMessage)) {
    return 'assistenza'
  }

  // Racing and team info
  if (/(campionat|championship|competition|serie)/i.test(lowerMessage)) {
    return 'campionati'
  }

  if (/(gara|gare|race|corsa|corse)/i.test(lowerMessage)) {
    return 'gare'
  }

  if (/(event|manifest|appuntament)/i.test(lowerMessage)) {
    return 'eventi'
  }

  if (/(team|pilot|driver|corridor)/i.test(lowerMessage)) {
    return 'team'
  }

  if (/(risultat|classific|podio|victory|vittori)/i.test(lowerMessage)) {
    return 'risultati'
  }

  if (/(sponsor|partner|collabora)/i.test(lowerMessage)) {
    return 'sponsor'
  }

  if (/(news|notizie|novità|aggiornament)/i.test(lowerMessage)) {
    return 'news'
  }

  // Additional products
  if (/(abbigliament|tuta|tute|guant|casco|caschi|scarpe|suit)/i.test(lowerMessage)) {
    return 'abbigliamento'
  }

  if (/(accessor|ricamb|attrezz|tool|lubrific|olio)/i.test(lowerMessage)) {
    return 'accessori'
  }

  if (/(categoria|categorie|mini|baby|ok|junior|kz|shifter)/i.test(lowerMessage)) {
    return 'categorie'
  }

  if (/(setup|regolaz|assett|taratur)/i.test(lowerMessage)) {
    return 'setup'
  }

  return 'default'
}

function getRandomResponse(category: string): string {
  const responseArray = responses[category as keyof typeof responses] || responses.default
  return responseArray[Math.floor(Math.random() * responseArray.length)]
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.sender !== 'user') {
      return NextResponse.json({
        message: 'Ciao! Come posso aiutarti?',
      })
    }

    // Detect intent from user message
    const intent = detectIntent(lastMessage.text)

    // Get appropriate response
    const response = getRandomResponse(intent)

    // Simulate a small delay for better UX (feels more natural)
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json({
      message: response,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json({
      message: 'Mi dispiace, si è verificato un problema tecnico. Per assistenza immediata, contattaci via email o telefono. Saremo felici di aiutarti!',
    })
  }
}
