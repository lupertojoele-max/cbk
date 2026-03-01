'use client'

export function ProductCardSkeleton() {
  return (
    <div
      style={{ height: '380px', width: '100%', overflow: 'hidden' }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      aria-hidden="true"
    >
      {/* Image area */}
      <div
        className="bg-gray-200 dark:bg-gray-700 animate-pulse"
        style={{ height: '180px', minHeight: '180px', maxHeight: '180px', width: '100%' }}
      />

      {/* Info area */}
      <div
        style={{
          height: '200px',
          minHeight: '200px',
          maxHeight: '200px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Brand row */}
        <div
          className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ height: '12px', width: '40%' }}
        />

        {/* Product name — 2 lines */}
        <div className="space-y-1.5">
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: '14px', width: '100%' }}
          />
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: '14px', width: '75%' }}
          />
        </div>

        {/* Description — 2 lines */}
        <div className="space-y-1.5 mt-1">
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: '11px', width: '100%' }}
          />
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: '11px', width: '65%' }}
          />
        </div>

        {/* Price row */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
          className="border-gray-100 dark:border-gray-700"
        >
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ height: '24px', width: '64px' }}
          />
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            style={{ width: '32px', height: '32px', minWidth: '32px' }}
          />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
