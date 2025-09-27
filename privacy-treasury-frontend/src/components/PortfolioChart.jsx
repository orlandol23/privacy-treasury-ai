import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

const PortfolioChart = ({ data = [], loading = false, className = '' }) => {
  const COLORS = [
    '#6c5ce7', // Electric Purple
    '#27ae60', // Success Green
    '#ff6b35', // Warning Orange
    '#8a7ff9', // Purple Hover
    '#a9a9b3'  // Text Secondary
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="treasury-card p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-lg font-bold text-primary">${data.value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{data.percentage}% of total portfolio</p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-foreground">{entry.value}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                ${entry.payload.value.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.payload.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const hasData = Array.isArray(data) && data.length > 0

  return (
    <div className={`treasury-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold text-foreground">Portfolio Allocation</h3>
        {loading && <Skeleton className="h-4 w-20 bg-muted/40" />}
      </div>
      
      <div className="h-64 flex items-center justify-center">
        {loading ? (
          <Skeleton className="h-full w-full bg-muted/20" />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">Not enough data to render the chart.</p>
        )}
      </div>

      {!loading && hasData && (
        <CustomLegend payload={data.map((item, index) => ({
          value: item.name,
          color: COLORS[index % COLORS.length],
          payload: item
        }))} />
      )}
    </div>
  )
}

export default PortfolioChart
