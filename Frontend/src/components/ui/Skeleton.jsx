// Skeleton loading component for content placeholders
const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => (
  <div className={`shimmer ${rounded} ${className}`} />
)

export const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-4 animate-pulse">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
)

export const ReportCardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
)

export const ResultSkeleton = () => (
  <div className="space-y-6">
    <div className="glass-card p-8 flex flex-col items-center gap-4">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  </div>
)

export default Skeleton
