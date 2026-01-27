import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function PageLoader({ 
  className, 
  size = "md",
  fullScreen = false 
}: PageLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="relative">
        {/* Main spinning circle */}
        <div
          className={cn(
            "border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin",
            sizeClasses[size]
          )}
        />
        
        {/* Pulsing outer ring */}
        <div
          className={cn(
            "absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-75",
            sizeClasses[size]
          )}
          style={{ animationDuration: "1.5s" }}
        />
        
        {/* Inner dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full animate-pulse",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
          )}
        />
      </div>
    </div>
  );
}

// Full screen page loader variant
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo or text */}
        <div className="relative">
          {/* Main spinner */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          
          {/* Pulsing rings */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-ping opacity-75" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-50 rounded-full animate-ping opacity-50" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full animate-pulse" />
        </div>
        
        {/* Loading text */}
        <p className="text-blue-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Skeleton loader with blue/white theme
export function PageSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-blue-100 rounded w-3/4" />
        <div className="h-4 bg-blue-50 rounded w-1/2" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-blue-50 rounded w-full" />
        <div className="h-4 bg-blue-50 rounded w-5/6" />
        <div className="h-4 bg-blue-50 rounded w-4/6" />
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 p-4 border border-blue-100 rounded-lg">
            <div className="h-32 bg-blue-50 rounded" />
            <div className="h-4 bg-blue-100 rounded w-3/4" />
            <div className="h-3 bg-blue-50 rounded w-full" />
            <div className="h-3 bg-blue-50 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

