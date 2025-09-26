import { DollarSign, TrendingUp, Shield, Users, AlertCircle, RefreshCw, Activity, Zap, GaugeCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MetricCard from './MetricCard'
import PortfolioChart from './PortfolioChart'
import AIRecommendations from './AIRecommendations'
import TransactionTable from './TransactionTable'
import MultiSigApproval from './MultiSigApproval'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDashboardData } from '@/hooks/use-dashboard-data'

const metricIconMap = {
  'treasury-value': DollarSign,
  'risk-score': Shield,
  'active-proposals': Users,
  performance: TrendingUp
}

const formatStatusLabel = (status) => {
  const normalized = String(status || '').toLowerCase()
  switch (normalized) {
    case 'excellent':
      return 'Excelente'
    case 'good':
      return 'Bom'
    case 'warning':
      return 'Alerta'
    case 'critical':
      return 'Crítico'
    case 'operational':
    case 'online':
      return 'Operacional'
    case 'degraded':
      return 'Degradado'
    default:
      return status ?? '—'
  }
}

const Dashboard = () => {
  const { loading, error, derived, issues, lastUpdated, refresh } = useDashboardData()

  const metrics = derived?.metrics ?? []
  const chartData = derived?.chartData ?? []
  const recommendations = derived?.recommendations ?? []
  const transactions = derived?.transactions ?? []
  const multiSigQueue = derived?.multiSigQueue ?? []
  const marketSignals = derived?.marketSignals ?? []
  const systemStatus = derived?.systemStatus ?? {}

  const formattedLastUpdated = lastUpdated ? new Date(lastUpdated).toLocaleString('pt-BR') : null

  const serviceStatuses = [
    {
      id: 'treasury',
      label: 'Midnight Network',
      status: systemStatus.health?.services?.treasury ?? 'operational',
      badge: 'success'
    },
    {
      id: 'ai',
      label: 'ElizaOS Agents',
      status: systemStatus.health?.services?.aiEngine ?? 'operational',
      badge: 'success'
    },
    {
      id: 'cross-chain',
      label: 'Cross-chain Orchestrator',
      status: systemStatus.health?.services?.crossChain ?? 'operational',
      badge: 'success'
    },
    {
      id: 'dega',
      label: 'DEGA MCP',
      status: systemStatus.degaStatus?.status ?? 'operational',
      badge: 'success'
    }
  ]

  const gasOptimization = systemStatus.gas?.gasOptimization ?? {}

  const statusColor = (status) => {
    const normalized = String(status || '').toLowerCase()
    if (['operational', 'online', 'ativo', 'excellent', 'good'].includes(normalized)) {
      return 'treasury-status-success'
    }
    if (['warning', 'degraded', 'partial'].includes(normalized)) {
      return 'treasury-status-warning'
    }
    if (!normalized) {
      return 'treasury-status-warning'
    }
    return 'treasury-status-error'
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Dashboard do Tesouro
          </h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de alocação, risco, IA e operações multi-chain
          </p>
        </div>
        <div className="flex items-center gap-3">
          {formattedLastUpdated && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Atualizado {formattedLastUpdated}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {error}. Tente novamente ou verifique a conectividade com a API do PrivacyTreasuryAI.
          </AlertDescription>
        </Alert>
      )}

      {!error && issues && issues.length > 0 && (
        <Alert className="border-warning-orange/40 bg-warning-orange/10">
          <AlertCircle className="h-4 w-4 text-warning-orange" />
          <AlertTitle>Alguns serviços retornaram avisos</AlertTitle>
          <AlertDescription>
            {issues.slice(0, 2).map((issue, index) => (
              <p key={index}>{issue.message}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metricIconMap[metric.id] ?? Activity}
            description={metric.description}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PortfolioChart data={chartData} loading={loading} />
          <TransactionTable
            transactions={transactions}
            loading={loading}
            lastUpdated={lastUpdated}
          />
        </div>

        <div className="space-y-6">
          <AIRecommendations
            recommendations={recommendations}
            loading={loading}
            lastUpdated={lastUpdated}
            issues={issues}
          />
          <MultiSigApproval
            pendingTransactions={multiSigQueue}
            loading={loading}
            lastUpdated={lastUpdated}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="treasury-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Insights de Mercado</h3>
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {marketSignals.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                Nenhum insight prioritário no momento. O motor de yield continua monitorando oportunidades.
              </p>
            )}

            {loading && (
              <div className="space-y-2">
                <div className="h-10 bg-muted/20 rounded"></div>
                <div className="h-10 bg-muted/20 rounded"></div>
                <div className="h-10 bg-muted/20 rounded"></div>
              </div>
            )}

            {!loading && marketSignals.map((signal) => (
              <div key={signal.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{signal.asset}</p>
                  <p className="text-xs text-muted-foreground">{signal.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-success-green">{signal.apy ? `${signal.apy}% APY` : 'Oportunidade'}</p>
                  <p className="text-xs text-muted-foreground">{signal.network}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="treasury-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Status do Sistema</h3>
            <GaugeCircle className="w-5 h-5 text-primary" />
          </div>

          <div className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-success-green" />
              <div>
                <p className="text-sm font-medium text-foreground">Saúde Geral</p>
                <p className="text-xs text-muted-foreground">{formatStatusLabel(systemStatus.performance?.status)}</p>
              </div>
            </div>
            <span className={`${statusColor(systemStatus.performance?.status)} text-xs`}>
              {formatStatusLabel(systemStatus.performance?.status)}
            </span>
          </div>

          <div className="space-y-3">
            {serviceStatuses.map((service) => {
              const colorClass = statusColor(service.status)
              return (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colorClass === 'treasury-status-success' ? 'bg-success-green' : colorClass === 'treasury-status-warning' ? 'bg-warning-orange' : 'bg-error-red'}`}></div>
                    <span className="text-sm text-muted-foreground">{service.label}</span>
                  </div>
                  <span className={`text-xs ${colorClass}`}>{formatStatusLabel(service.status)}</span>
                </div>
              )
            })}
          </div>

          {gasOptimization && Object.keys(gasOptimization).length > 0 && (
            <div className="pt-3 border-t border-border/60">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Otimização de Gas (estimativa)</p>
              <div className="space-y-3 text-xs">
                {Object.entries(gasOptimization).map(([chain, stats]) => {
                  const savings = stats?.savings ?? (stats?.recommendedGwei ? `${stats.recommendedGwei} gwei` : stats?.recommendedLamports ? `${stats.recommendedLamports} lamports` : '—')
                  const optimalTime = stats?.optimalTime ? `Melhor horário: ${stats.optimalTime}` : null
                  return (
                    <div key={chain} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide">{chain}</p>
                        {optimalTime && <p className="text-[11px] text-muted-foreground/70">{optimalTime}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-success-green">{savings}</p>
                        {stats?.recommendedGwei && (
                          <p className="text-[11px] text-muted-foreground/70">Recomendado: {stats.recommendedGwei} gwei</p>
                        )}
                        {stats?.recommendedLamports && (
                          <p className="text-[11px] text-muted-foreground/70">Recomendado: {stats.recommendedLamports} lamports</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
