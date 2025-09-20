export function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Season Selector Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-racing-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 bg-racing-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-racing-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-racing-gray-200 rounded w-40 animate-pulse" />
            <div className="h-10 bg-racing-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-racing-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-racing-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-racing-gray-200 rounded w-16 animate-pulse" />
              <div className="h-4 bg-racing-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Standings Table Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-racing-gray-200">
        {/* Table Header */}
        <div className="border-b border-racing-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-racing-gray-200 rounded w-48 animate-pulse" />
            <div className="h-10 bg-racing-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-racing-gray-50">
              <tr>
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="p-4">
                    <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-racing-gray-100">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Races Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-racing-gray-200">
        <div className="border-b border-racing-gray-200 p-6">
          <div className="h-8 bg-racing-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-racing-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-racing-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-racing-gray-200 rounded w-48 animate-pulse" />
                  <div className="h-3 bg-racing-gray-200 rounded w-32 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-racing-gray-200 rounded w-16 animate-pulse" />
                <div className="h-3 bg-racing-gray-200 rounded w-12 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}