export function ContactSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-racing-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-racing-gray-200 rounded w-3/4 animate-pulse" />
          </div>

          {/* Form fields skeleton */}
          <div className="space-y-6">
            {/* Name field */}
            <div className="space-y-2">
              <div className="h-4 bg-racing-gray-200 rounded w-16 animate-pulse" />
              <div className="h-12 bg-racing-gray-200 rounded animate-pulse" />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <div className="h-4 bg-racing-gray-200 rounded w-20 animate-pulse" />
              <div className="h-12 bg-racing-gray-200 rounded animate-pulse" />
            </div>

            {/* Message field */}
            <div className="space-y-2">
              <div className="h-4 bg-racing-gray-200 rounded w-24 animate-pulse" />
              <div className="h-32 bg-racing-gray-200 rounded animate-pulse" />
            </div>

            {/* Submit button */}
            <div className="h-12 bg-racing-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Contact Info Skeleton */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-racing-gray-200 rounded w-40 animate-pulse" />
            <div className="h-4 bg-racing-gray-200 rounded w-5/6 animate-pulse" />
          </div>

          {/* Contact cards skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-racing-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-racing-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-racing-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-racing-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional info skeleton */}
          <div className="bg-racing-red/10 rounded-lg p-6 space-y-4">
            <div className="h-6 bg-racing-gray-200 rounded w-32 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-racing-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-racing-gray-200 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}