import { Brain, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const AIRecommendations = ({ recommendations = [], loading = false, lastUpdated, issues = [], className = '' }) => {
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'rebalance':
        return <TrendingUp className="w-5 h-5 text-primary" />
      case 'security':
        return <Shield className="w-5 h-5 text-success-green" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-orange" />
      default:
        return <Brain className="w-5 h-5 text-primary" />
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success-green'
    if (confidence >= 60) return 'text-warning-orange'
    return 'text-error-red'
  }

  const displayRecommendations = recommendations.length > 0 ? recommendations : []

  const priorityLabel = (priority) => {
    const normalized = priority?.toLowerCase?.() ?? 'medium'
    if (normalized === 'high') return 'Alta'
    if (normalized === 'low') return 'Baixa'
    return 'Média'
  }

  return (
    <div className={`treasury-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recomendações da IA</h3>
            <p className="text-sm text-muted-foreground">Insights baseados em machine learning</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {loading ? (
            <Skeleton className="h-3 w-16 bg-muted/40" />
          ) : (
            <>
              <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">{lastUpdated ? `Atualizado ${new Date(lastUpdated).toLocaleTimeString('pt-BR')}` : 'Ativo'}</span>
            </>
          )}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-24 w-full bg-muted/20" />
            <Skeleton className="h-24 w-full bg-muted/20" />
          </>
        )}

        {!loading && displayRecommendations.length === 0 && (
          <div className="p-4 bg-muted/20 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
            Nenhuma nova recomendação da IA no momento. O motor continuará analisando o mercado.
          </div>
        )}

        {!loading && displayRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id}
            className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getRecommendationIcon(recommendation.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">
                      {recommendation.title}
                    </h4>
                    <span className={`text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                      {Math.min(100, Math.max(0, recommendation.confidence))}% confiança
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      className="treasury-button-primary h-8 px-4 text-xs"
                    >
                      {recommendation.action}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-4 text-xs"
                    >
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Priority Indicator */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                recommendation.priority === 'high' 
                  ? 'bg-error-red/20 text-error-red' 
                  : recommendation.priority === 'medium'
                  ? 'bg-warning-orange/20 text-warning-orange'
                  : 'bg-success-green/20 text-success-green'
              }`}>
                {priorityLabel(recommendation.priority)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success-green" />
            {loading ? (
              <Skeleton className="h-3 w-32 bg-muted/40" />
            ) : (
              <span className="text-xs text-muted-foreground">
                {lastUpdated
                  ? `Última análise: ${new Date(lastUpdated).toLocaleString('pt-BR')}`
                  : 'Última análise recente'}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver Todas as Recomendações
          </Button>
        </div>

        {!loading && issues.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-warning-orange/10 border border-warning-orange/40 text-xs text-warning-orange">
            Alguns serviços de suporte estão instáveis: {issues.slice(0, 2).map((item) => item.message).join('; ')}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIRecommendations
