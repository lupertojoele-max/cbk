import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <span className="text-9xl font-black text-racing-red leading-none">404</span>
        </div>
        <div className="w-16 h-1 bg-racing-red mx-auto mb-6 rounded-full" />
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">
          Questa pagina è uscita di pista
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          La pagina che cerchi non esiste o è stata spostata.
          Torna al catalogo per trovare quello che ti serve.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/prodotti"
            className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white font-bold rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all duration-150"
          >
            Vai al Catalogo
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:border-racing-red hover:text-racing-red active:scale-[0.98] transition-all duration-150"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
