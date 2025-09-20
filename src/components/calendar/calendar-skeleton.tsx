export function CalendarSkeleton() {
  return (
    <div className="space-y-12">
      {/* Month sections skeleton */}
      {Array.from({ length: 6 }).map((_, monthIndex) => (
        <div key={monthIndex} className="space-y-6">
          {/* Month header skeleton */}
          <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-sm border-b border-racing-gray-200 py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-racing-gray-200 rounded w-48 animate-pulse" />
              <div className="h-6 bg-racing-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Events skeleton */}
          <div className="space-y-4">
            {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, eventIndex) => (
              <div key={eventIndex} className="bg-white rounded-lg shadow-sm border border-racing-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date skeleton */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-racing-gray-200 rounded-lg animate-pulse" />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-racing-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-racing-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="flex items-center gap-4">
                      <div className="h-4 bg-racing-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-racing-gray-200 rounded w-32 animate-pulse" />
                    </div>
                  </div>

                  {/* Action skeleton */}
                  <div className="flex-shrink-0">
                    <div className="h-10 bg-racing-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}