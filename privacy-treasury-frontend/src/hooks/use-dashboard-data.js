import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apiClient } from '@/services/api'

const DEFAULT_PORTFOLIO = [
  { symbol: 'USDC', amount: 1250000, valueUSD: 1250000, percentage: 34 },
  { symbol: 'ETH', amount: 350, valueUSD: 720000, percentage: 28 },
  { symbol: 'BTC', amount: 12, valueUSD: 620000, percentage: 22 },
  { symbol: 'DEGA', amount: 45000, valueUSD: 280000, percentage: 8 },
  { symbol: 'MID', amount: 90000, valueUSD: 180000, percentage: 8 }
]

const DEFAULT_TARGET_ALLOCATION = {
  USDC: 32,
  ETH: 30,
  BTC: 20,
  DEGA: 10,
  MID: 8
}

const DEFAULT_MARKET_CONDITIONS = {
  volatility: 'moderate',
  marketBias: 'neutral',
  liquidity: 'high'
}

const DEFAULT_WALLET_ADDRESS = '0xDAO-TREASURY-001'
const DEFAULT_GAME_ID = 'privacy-treasury-alpha'

const INITIAL_STATE = {
  portfolio: null,
  recommendations: null,
  mlOptimization: null,
  rebalance: null,
  riskAssessment: null,
  yieldOptimization: null,
  systemPerformance: null,
  systemHealth: null,
  gasOptimization: null,
  correlationMatrix: null,
  multiChainBalances: null,
  gameAnalytics: null,
  degaStatus: null,
  issues: []
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(INITIAL_STATE)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  const loadDashboard = useCallback(async () => {
    if (!isMountedRef.current) return

    setLoading(true)
    setError(null)

    const assetAllocation = DEFAULT_PORTFOLIO.map((asset) => ({
      symbol: asset.symbol,
      percentage: asset.percentage
    }))
    const targetAllocation = Object.entries(DEFAULT_TARGET_ALLOCATION).map(([symbol, percentage]) => ({
      symbol,
      targetPercentage: percentage
    }))

    try {
      const results = await Promise.allSettled([
        apiClient.analyzePortfolio(DEFAULT_PORTFOLIO),
        apiClient.aiRecommendations(assetAllocation, DEFAULT_MARKET_CONDITIONS),
        apiClient.mlOptimization(DEFAULT_PORTFOLIO, {
          riskTolerance: 4,
          timeHorizon: 12
        }),
        apiClient.simulateRebalance(DEFAULT_PORTFOLIO, targetAllocation),
        apiClient.riskAssessment(DEFAULT_PORTFOLIO),
        apiClient.yieldOptimization(DEFAULT_PORTFOLIO, {
          strategy: 'balanced-liquidity-staking',
          riskLevel: 'moderate'
        }),
        apiClient.systemPerformance(),
        apiClient.systemHealth(),
        apiClient.gasOptimization(),
        apiClient.correlationAnalysis(),
        apiClient.multiChainBalances(DEFAULT_WALLET_ADDRESS),
        apiClient.gameTreasuryAnalytics(DEFAULT_GAME_ID),
        apiClient.degaServiceStatus()
      ])

      if (!isMountedRef.current) {
        return
      }

      const [
        portfolio,
        recommendations,
        mlOptimization,
        rebalance,
        riskAssessment,
        yieldOptimization,
        systemPerformance,
        systemHealth,
        gasOptimization,
        correlationMatrix,
        multiChainBalances,
        gameAnalytics,
        degaStatus
      ] = results.map((result) => (result.status === 'fulfilled' ? result.value : null))

      const issues = results
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ result, index }) => ({
          source: index,
          message: result.reason?.message || 'Erro ao carregar dados'
        }))

      setData({
        portfolio,
        recommendations,
        mlOptimization,
        rebalance,
        riskAssessment,
        yieldOptimization,
        systemPerformance,
        systemHealth,
        gasOptimization,
        correlationMatrix,
        multiChainBalances,
        gameAnalytics,
        degaStatus,
        issues
      })

      setError(null)
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Não foi possível carregar os dados do dashboard')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    loadDashboard()

    const intervalId = setInterval(() => {
      loadDashboard()
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [loadDashboard])

  const derived = useMemo(() => {
    const portfolioMetrics = data.portfolio ?? {}
    const riskMetrics = data.riskAssessment ?? {}
    const optimizationMetrics = data.mlOptimization?.optimization ?? {}
    const expectedMetrics = optimizationMetrics?.expectedMetrics ?? {}
    const performanceMetrics = data.systemPerformance?.performance ?? {}
    const healthMetrics = data.systemHealth ?? {}

    const totalValue = portfolioMetrics.totalValueUSD ?? 0
    const riskScore = portfolioMetrics.riskScore ?? riskMetrics.overallRiskLevel ?? 'Moderado'
    const performance30d = expectedMetrics.thirtyDay ?? null
    const expectedReturn = expectedMetrics.annualReturn ?? null
    const monthlyGrowth = typeof portfolioMetrics.monthlyGrowth === 'number'
      ? portfolioMetrics.monthlyGrowth
      : typeof expectedMetrics.monthlyGrowth === 'number'
        ? expectedMetrics.monthlyGrowth
        : null

    const chartData = (portfolioMetrics.assets || DEFAULT_PORTFOLIO).map((asset) => ({
      name: asset.symbol,
      value: asset.valueUSD ?? asset.amount ?? 0,
      percentage: asset.percentage ?? 0
    }))

    const baseConfidence = Math.round(((data.recommendations?.confidenceScore ?? 0.75) * 100))
    const recommendations = (data.recommendations?.recommendations ?? []).map((item, index) => {
      const rawConfidence = typeof item.confidence === 'number' ? item.confidence : item.confidenceScore
      const normalizedConfidence = rawConfidence
        ? rawConfidence > 1
          ? rawConfidence
          : Math.round(rawConfidence * 100)
        : baseConfidence
      const rawPriority = typeof item.priority === 'string' ? item.priority.toLowerCase() : undefined

      return {
        id: item.id ?? index,
        type: (item.category ?? item.action ?? 'rebalance').toString().toLowerCase(),
        title: item.title ?? item.suggestion ?? 'Recomendação da IA',
        description: item.reason ?? item.rationale ?? item.description ?? 'A IA sugere analisar esta oportunidade.',
        confidence: normalizedConfidence,
        action: item.actionLabel ?? item.action ?? 'Analisar',
        priority: rawPriority ?? (normalizedConfidence >= 80 ? 'high' : normalizedConfidence >= 60 ? 'medium' : 'low')
      }
    })

    const transactionChanges = data.rebalance?.proposedChanges ?? []
    const transactions = transactionChanges.map((change, index) => {
      const action = (change.action || '').toString().toLowerCase()
      const amount = Math.abs(change.amountUSD ?? change.amount ?? 0)

      return {
        id: `${change.symbol ?? change.asset}-${index}`,
        date: new Date().toLocaleDateString('pt-BR'),
        description: `Rebalanceamento ${change.symbol ?? change.asset}`,
        type: action === 'buy' || action === 'increase' ? 'outgoing' : action === 'sell' ? 'incoming' : 'pending',
        amount: Number.isFinite(amount) ? amount : 0,
        asset: change.symbol ?? change.asset ?? 'USDC',
        status: amount > 0 ? 'completed' : 'pending',
        hash: change.transactionHash ?? '—'
      }
    })

    const defaultSigners = [
      { address: '0x1234...5678', signed: true, name: 'Alice' },
      { address: '0x2345...6789', signed: false, name: 'Bob' },
      { address: '0x3456...7890', signed: false, name: 'Carol' }
    ]

    const multiSigQueue = (transactionChanges.length > 0
      ? transactionChanges.slice(0, 3)
      : portfolioMetrics.assets?.slice(0, 3) ?? []).map((item, index) => ({
      id: item.id ?? `proposal-${index}`,
      amount: item.amountUSD ?? item.valueUSD ?? 0,
      asset: item.symbol ?? item.asset ?? 'USDC',
      description: item.description ?? `Ajuste de alocação para ${item.symbol ?? item.asset}`,
      requiredSignatures: 3,
      currentSignatures: index % 3 === 0 ? 2 : 1,
      signers: item.signers ?? defaultSigners,
      createdAt: new Date().toLocaleString('pt-BR'),
      expiresAt: new Date(Date.now() + (index + 1) * 86400000).toLocaleString('pt-BR')
    }))

    const activeProposals = multiSigQueue.length
    const pendingApprovals = multiSigQueue.filter(
      (item) => item.currentSignatures < item.requiredSignatures
    ).length

    const metrics = [
      {
        id: 'treasury-value',
        title: 'Valor Total do Tesouro',
        value: totalValue > 0 ? `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—',
        change: monthlyGrowth !== null ? `${monthlyGrowth.toFixed(1)}%` : '+0%',
        changeType: monthlyGrowth !== null && monthlyGrowth >= 0 ? 'positive' : 'negative',
        description: 'Crescimento mensal'
      },
      {
        id: 'risk-score',
        title: 'Score de Risco',
        value: typeof riskScore === 'number' ? `${riskScore.toFixed(1)}/100` : String(riskScore),
        change: riskMetrics?.riskTrend ?? 'Estável',
        changeType: 'neutral',
        description: 'Diversificação do portfólio'
      },
      {
        id: 'active-proposals',
        title: 'Propostas Ativas',
        value: String(activeProposals),
        change: pendingApprovals ? `+${pendingApprovals}` : 'Estável',
        changeType: pendingApprovals > 0 ? 'positive' : 'neutral',
        description: 'Governança em votação'
      },
      {
        id: 'performance',
        title: 'Performance 30d',
        value: performance30d ? `${performance30d.toFixed(2)}%` : expectedReturn ? `${expectedReturn.toFixed(2)}%` : '+0%',
        change: performanceMetrics?.responseTime?.p95 ? `${performanceMetrics.responseTime.p95}ms p95` : '+0,0%',
        changeType: 'positive',
        description: 'Comparativo com benchmark'
      }
    ]

    const opportunities = data.yieldOptimization?.topOpportunities ?? data.yieldOptimization?.opportunities ?? []
    const marketSignals = opportunities.slice(0, 3).map((op, index) => ({
      id: op.id ?? index,
      asset: op.asset ?? op.protocol ?? '—',
      apy: op.apy ?? op.projectedApy ?? 0,
      description: op.strategy ?? 'Estratégia sugerida',
      network: op.network ?? 'Multi-chain'
    }))

    const systemStatus = {
      performance: {
        status: data.systemPerformance?.status ?? 'operational',
        responseTime: performanceMetrics?.responseTime,
        cache: performanceMetrics?.cache,
        uptime: performanceMetrics?.uptime
      },
      health: {
        status: healthMetrics.status ?? 'operational',
        services: healthMetrics.services ?? {}
      },
      gas: data.gasOptimization,
      degaStatus: data.degaStatus ?? {}
    }

    return {
      metrics,
      chartData,
      recommendations,
      transactions,
      multiSigQueue,
      marketSignals,
      systemStatus
    }
  }, [data])

  const lastUpdated = data.portfolio?.timestamp
    ?? data.systemPerformance?.timestamp
    ?? data.systemHealth?.timestamp
    ?? null

  return {
    loading,
    error,
    data,
    derived,
    issues: data.issues,
    lastUpdated,
    refresh: loadDashboard
  }
}

export default useDashboardData
