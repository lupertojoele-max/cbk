import Link from 'next/link'
import {
  Trophy,
  Users,
  Wrench,
  BarChart2,
  Flag,
  Target,
  ChevronRight,
  Award,
  Shield,
  Zap,
} from 'lucide-react'

const stats = [
  { value: '15+', label: 'Anni di attività' },
  { value: '200+', label: 'Piloti formati' },
  { value: '50+', label: 'Titoli vinti' },
  { value: '3', label: 'Campionati mondiali' },
]

const metodologia = [
  {
    icon: BarChart2,
    title: 'Analisi dati in pista',
    description:
      `Ogni sessione viene registrata e analizzata: tempi settore, temperature gomme, pressioni, punti di frenata, traiettorie. Il debriefing è parte integrante dell'allenamento, non un optional.`,
  },
  {
    icon: Wrench,
    title: 'Meccanico dedicato',
    description:
      `Ogni pilota ha un meccanico di riferimento che conosce il suo kart nei minimi dettagli. L'assetto non è mai casuale: viene costruito sulla base dei dati e dello stile di guida.`,
  },
  {
    icon: Target,
    title: 'Coaching individuale',
    description:
      `Niente sessioni di gruppo generiche. Ogni pilota riceve feedback tecnici specifici sulla sua guida, con obiettivi misurabili da raggiungere di settimana in settimana.`,
  },
  {
    icon: Zap,
    title: 'Preparazione al salto di categoria',
    description:
      `Lavoriamo con un orizzonte temporale chiaro: dove deve essere questo pilota tra 12 mesi? La progressione è pianificata, non affidata al caso o ai risultati del singolo weekend.`,
  },
]

const standard = [
  { title: 'Puntualità assoluta', description: `Gli orari non sono indicativi. Ogni minuto in pista costa preparazione, concentrazione e opportunità. I ritardi non vengono tollerati.` },
  { title: 'Kart sempre impeccabile', description: `Il mezzo riflette il team. Un kart sporco o trascurato non entra in pista. La cura del materiale è disciplina, non estetica.` },
  { title: 'Mentalità professionale', description: `Ci alleniamo come professionisti indipendentemente dalla categoria. L'attitudine al miglioramento continuo si costruisce prima del livello pro, non dopo.` },
  { title: 'Comunicazione diretta', description: `Diciamo la verità ai piloti e alle famiglie: sui punti di forza, sui margini di miglioramento, sui tempi realistici di sviluppo. Senza filtri.` },
]

const risultati = [
  { anno: '[ANNO]', traguardo: 'Titolo Campionato Nazionale — Categoria [CAT]', pilota: '[Nome Pilota]' },
  { anno: '[ANNO]', traguardo: 'Podio Campionato Europeo — Categoria [CAT]', pilota: '[Nome Pilota]' },
  { anno: '[ANNO]', traguardo: 'Titolo Campionato Mondiale — Categoria [CAT]', pilota: '[Nome Pilota]' },
  { anno: '[ANNO]', traguardo: 'Campionato Italiano [CAT] — [X] podi stagionali', pilota: '[Nome Pilota]' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-racing-carbon pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-racing-red" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12">
            <Link href="/" className="hover:text-racing-red transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Chi Siamo</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-racing-red/10 border border-racing-red/30 rounded-full px-4 py-1.5 mb-8">
              <Flag className="w-3.5 h-3.5 text-racing-red" />
              <span className="text-xs text-racing-red font-black uppercase tracking-widest">
                CB Kart Varese — Varese, Italia
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-8">
              Non formiamo<br />
              <span className="text-racing-red">piloti veloci.</span><br />
              Formiamo piloti<br />completi.
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              CB Kart Varese è un team agonistico con una struttura tecnica da categoria superiore.
              Dal bambino al suo primo kart al pilota che punta al professionismo,
              il metodo non cambia — cambia solo l'intensità.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-racing-red py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-black text-white mb-1 racing-number">{s.value}</div>
                <div className="text-red-200 text-xs uppercase tracking-widest font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHI SIAMO / MISSIONE ─────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            <div>
              <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-5">Chi siamo</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-8">
                Un team.<br />
                Un <span className="text-racing-red">metodo.</span><br />
                Nessuna scorciatoia.
              </h2>
              <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                <p>
                  CB Kart Varese nasce a Varese con un obiettivo preciso: costruire un ambiente
                  in cui i piloti crescano in modo strutturato, non affidandosi al talento grezzo
                  ma sviluppando competenza tecnica, consapevolezza del mezzo e mentalità agonistica.
                </p>
                <p>
                  Negli anni abbiamo formato piloti di ogni livello — dai primi giri in pista
                  fino ai campionati nazionali, europei e mondiali. Il filo comune non è mai stato
                  il budget o il kart più veloce: è sempre stato il <strong className="text-gray-900 dark:text-white">metodo di lavoro</strong>.
                </p>
                <p>
                  Ogni pilota che entra nel team trova una struttura completa: coaching tecnico
                  individuale, meccanico dedicato, analisi dati dopo ogni sessione, pianificazione
                  stagionale e un contesto in cui la disciplina è il punto di partenza,
                  non un obiettivo da raggiungere.
                </p>
              </div>
            </div>

            {/* Missione / Visione */}
            <div className="space-y-6 pt-2">
              <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-racing-red rounded-r-2xl p-8">
                <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-3">Missione</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg leading-snug">
                  Formare piloti competitivi attraverso un percorso tecnico strutturato,
                  indipendentemente dal punto di partenza.
                </p>
              </div>
              <div className="bg-racing-carbon border border-racing-red/20 rounded-2xl p-8">
                <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-3">Visione</p>
                <p className="text-white font-bold text-lg leading-snug">
                  Diventare l'academy di riferimento nel karting italiano:
                  la struttura che i piloti scelgono quando vogliono fare sul serio.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-3">Target</p>
                <div className="space-y-2">
                  {['Bambini dai 4 anni — prime esperienze in pista', 'Giovani agonisti 8–18 anni — percorso federale', 'Piloti adulti — sviluppo tecnico e agonismo', 'Piloti pro — struttura tecnica di alto livello'].map((t) => (
                    <div key={t} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-racing-red flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METODO ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-4">Come lavoriamo</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Il metodo <span className="text-racing-red">CB Kart</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base">
              Struttura tecnica da team professionistico applicata a ogni categoria,
              dal primo corso all'agonismo internazionale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metodologia.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:border-racing-red/40 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-racing-red rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">{m.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{m.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STANDARD / CULTURA ───────────────────────────────────────────── */}
      <section className="py-24 bg-racing-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

            <div className="lg:col-span-2">
              <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-5">Cultura del team</p>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-6">
                Gli standard<br />non si negoziano.
              </h2>
              <p className="text-gray-400 leading-relaxed text-base">
                In CB Kart Varese ci sono regole non scritte che diventano rapidamente
                ovvie a chiunque entri nel team. Non sono vincoli — sono il livello minimo
                che permette di lavorare seriamente.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {standard.map((s, i) => (
                <div
                  key={s.title}
                  className="bg-white/5 border border-white/10 hover:border-racing-red/40 rounded-xl p-6 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-8 h-8 bg-racing-red/10 border border-racing-red/30 rounded-lg flex items-center justify-center flex-shrink-0 text-racing-red font-black text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="font-black text-white mb-1.5">{s.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RISULTATI ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-4">Track record</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              I risultati <span className="text-racing-red">parlano.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-sm">
              {/* TODO: aggiornare con i risultati reali del team */}
              Una selezione dei traguardi più significativi raggiunti dai piloti CB Kart Varese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {risultati.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:border-racing-red/30 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-racing-red rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-racing-red font-black uppercase tracking-widest mb-1">{r.anno}</p>
                  <p className="font-black text-gray-900 dark:text-white text-sm leading-snug mb-0.5">{r.traguardo}</p>
                  <p className="text-xs text-gray-500">{r.pilota}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMY / FUTURO ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-racing-red/10 border border-racing-red/30 rounded-full px-4 py-1.5 mb-8">
              <Award className="w-3.5 h-3.5 text-racing-red" />
              <span className="text-xs text-racing-red font-black uppercase tracking-widest">In costruzione</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">
              L'academy è il<br />
              prossimo <span className="text-racing-red">passo.</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base mb-6">
              Stiamo strutturando un programma academy formale: percorsi stagionali certificati,
              selezione talenti, raccordo con le federazioni e un sistema di sviluppo pilota
              che va dal debutto in pista fino alle categorie internazionali.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base mb-10">
              L'obiettivo non è crescere in numero — è costruire la struttura che permette
              ai piloti giusti di arrivare dove meritano. Un nome, uno standard, una reputazione.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                { icon: Users, label: 'Percorsi stagionali strutturati per fascia di età e categoria' },
                { icon: BarChart2, label: 'Analisi dati sistematizzata e reportistica per piloti e famiglie' },
                { icon: Shield, label: 'Accordi di fornitura tecnica con i principali brand del settore' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-start gap-4">
                    <Icon className="w-5 h-5 text-racing-red flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug font-medium">{item.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / SPONSOR ────────────────────────────────────────────────── */}
      <section className="py-24 bg-racing-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Piloti */}
            <div className="bg-white/5 border border-white/10 hover:border-racing-red/40 rounded-2xl p-10 transition-all duration-300">
              <Flag className="w-10 h-10 text-racing-red mb-6" />
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                Vuoi correre con noi?
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm">
                Se cerchi un team che lavora sul serio — analisi dati, meccanico dedicato,
                coaching individuale — parla con noi. Apriamo le selezioni per la prossima stagione.
              </p>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 bg-racing-red hover:bg-racing-red-dark text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Candidati al team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Sponsor */}
            <div className="bg-white/5 border border-white/10 hover:border-racing-red/40 rounded-2xl p-10 transition-all duration-300">
              <Award className="w-10 h-10 text-racing-red mb-6" />
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                Vuoi supportare il team?
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Offriamo visibilità reale: presenza su kart, tute e abbigliamento,
                merchandising, contenuti social e circuiti in tutto il territorio nazionale e internazionale.
                La vostra azienda associata a un team con una storia di risultati.
              </p>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-racing-red text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-lg transition-all duration-200"
              >
                Diventa sponsor
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
