import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  description,
  loading = false,
  className = ''
}) => {
  console.info('[MetricCard] render', { title, value, change, loading })
  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-success-green" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-error-red" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-green'
      case 'negative':
        return 'text-error-red'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={`treasury-metric-card treasury-hover-lift ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <span className="treasury-metric-label">{title}</span>
        </div>
        {change && !loading && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
        {loading && (
          <Skeleton className="h-4 w-16 bg-muted/50" />
        )}
      </div>

      {/* Value */}
      <div className="treasury-metric-value">
        {loading ? <Skeleton className="h-8 w-24 bg-muted/50" /> : value}
      </div>

      {/* Description */}
      {description && (
        <div className="text-sm text-muted-foreground">
          {loading ? <Skeleton className="h-4 w-36 bg-muted/40" /> : description}
        </div>
      )}
    </div>
  )
}

export default MetricCard
