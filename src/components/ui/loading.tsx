import { cn } from '@/lib/utils'
import { Loader2, Zap } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'default' | 'racing' | 'white'
}

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    default: 'text-racing-gray-500',
    racing: 'text-racing-red',
    white: 'text-white'
  }

  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

interface LoadingStateProps {
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  racing?: boolean
}

export function LoadingState({
  children,
  className,
  size = 'md',
  text = 'Loading...',
  racing = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  }

  const spinnerSizes = {
    sm: 'md' as const,
    md: 'lg' as const,
    lg: 'xl' as const
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses[size],
      className
    )}>
      {racing ? (
        <div className="relative">
          <div className="animate-pulse bg-racing-red/10 p-3 rounded-full mb-4">
            <Zap className="w-6 h-6 text-racing-red animate-bounce" />
          </div>
          <div className="absolute inset-0 animate-ping bg-racing-red/20 rounded-full" />
        </div>
      ) : (
        <LoadingSpinner
          size={spinnerSizes[size]}
          color="racing"
          className="mb-4"
        />
      )}

      <p className="text-racing-gray-600 font-medium">
        {text}
      </p>

      {children && (
        <div className="mt-4 text-sm text-racing-gray-500">
          {children}
        </div>
      )}
    </div>
  )
}

interface PageLoadingProps {
  title?: string
  subtitle?: string
}

export function PageLoading({
  title = 'Loading Page...',
  subtitle = 'Please wait while we prepare your content'
}: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-racing-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <LoadingState
          size="lg"
          text={title}
          racing
        >
          <p className="text-racing-gray-500">
            {subtitle}
          </p>
        </LoadingState>
      </div>
    </div>
  )
}

interface DataLoadingProps {
  text?: string
  compact?: boolean
  className?: string
}

export function DataLoading({
  text = 'Loading data...',
  compact = false,
  className
}: DataLoadingProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <LoadingSpinner size="sm" color="racing" className="mr-2" />
        <span className="text-sm text-racing-gray-600">{text}</span>
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-racing-gray-200',
      className
    )}>
      <LoadingSpinner size="lg" color="racing" className="mb-4" />
      <p className="text-racing-gray-600 font-medium">{text}</p>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-racing-gray-200',
        className
      )}
      {...props}
    />
  )
}

// Card skeleton for consistent loading states
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white border rounded-lg overflow-hidden', className)}>
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

// List item skeleton
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-4 p-4', className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-racing-gray-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 p-4 border-b border-racing-gray-100" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner