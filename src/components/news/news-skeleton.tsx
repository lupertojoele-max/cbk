export function NewsSkeleton() {
  return (
    <div className="space-y-8" id="latest-news">
      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-racing-gray-200 rounded-full w-24 animate-pulse" />
        ))}
      </div>

      {/* News Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-racing-gray-200 overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-video bg-racing-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              {/* Category and date */}
              <div className="flex justify-between items-center">
                <div className="h-6 bg-racing-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded w-16 animate-pulse" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-6 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-racing-gray-200 rounded w-3/4 animate-pulse" />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded w-1/2 animate-pulse" />
              </div>

              {/* Author and stats */}
              <div className="flex justify-between items-center pt-4 border-t border-racing-gray-100">
                <div className="h-4 bg-racing-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 bg-racing-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <div className="h-10 bg-racing-gray-200 rounded w-20 animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-racing-gray-200 rounded w-10 animate-pulse" />
        ))}
        <div className="h-10 bg-racing-gray-200 rounded w-20 animate-pulse" />
      </div>
    </div>
  )
}