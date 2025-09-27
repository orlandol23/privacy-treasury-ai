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
  console.info('[Dashboard] load start')
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
          message: result.reason?.message || 'Failed to load data'
        }))

      const nextData = {
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
      }

  console.info('[Dashboard] data loaded', nextData)

      setData(nextData)

      setError(null)
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Unable to load dashboard data')
  console.error('[Dashboard] load error', err)
      }
    } finally {
      if (isMountedRef.current) {
  console.info('[Dashboard] load end')
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

    const translateLabel = (value) => {
      if (typeof value !== 'string') return value
      const normalized = value.normalize('NFD').replace(/[^\w\s-]/g, '').toLowerCase()
      switch (normalized) {
        case 'moderado':
          return 'Moderate'
        case 'alto':
        case 'elevado':
          return 'High'
        case 'baixo':
          return 'Low'
  case 'critico':
  case 'critico-urgente':
          return 'Critical'
        case 'estavel':
          return 'Stable'
        case 'desconhecido':
          return 'Unknown'
        default:
          return value
      }
    }

    const fallbackTotalValue = DEFAULT_PORTFOLIO.reduce((sum, asset) => sum + (asset.valueUSD ?? 0), 0)
    const totalValue = portfolioMetrics.totalValueUSD ?? fallbackTotalValue
    const riskScoreRaw = portfolioMetrics.riskScore ?? riskMetrics.overallRiskLevel ?? 'Moderate'
    const riskScore = translateLabel(riskScoreRaw)
    const performance30d = typeof expectedMetrics.thirtyDay === 'number'
      ? expectedMetrics.thirtyDay
      : typeof portfolioMetrics.performance30d === 'number'
        ? portfolioMetrics.performance30d
        : null
    const expectedReturn = typeof expectedMetrics.annualReturn === 'number'
      ? expectedMetrics.annualReturn
      : typeof portfolioMetrics.expectedAnnualReturn === 'number'
        ? portfolioMetrics.expectedAnnualReturn
        : 14.2
    const riskTrend = translateLabel(riskMetrics?.riskTrend ?? 'Stable')
    const monthlyGrowth = typeof portfolioMetrics.monthlyGrowth === 'number'
      ? portfolioMetrics.monthlyGrowth
      : typeof expectedMetrics.monthlyGrowth === 'number'
        ? expectedMetrics.monthlyGrowth
        : 2.4
    const displayPerformance = performance30d ?? (typeof expectedReturn === 'number' ? expectedReturn / 12 : 4.2)

    const chartData = (portfolioMetrics.assets || DEFAULT_PORTFOLIO).map((asset) => ({
      name: asset.symbol,
      value: asset.valueUSD ?? asset.amount ?? 0,
      percentage: asset.percentage ?? 0
    }))

    const baseConfidence = Math.round(((data.recommendations?.confidenceScore ?? 0.75) * 100))
    const rawRecommendations = Array.isArray(data.recommendations?.recommendations)
      ? data.recommendations.recommendations
      : []
    const mappedRecommendations = rawRecommendations.map((item, index) => {
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
        title: item.title ?? item.suggestion ?? 'AI Recommendation',
        description: item.reason ?? item.rationale ?? item.description ?? 'The AI suggests reviewing this opportunity.',
        confidence: normalizedConfidence,
        action: item.actionLabel ?? item.action ?? 'Review',
        priority: rawPriority ?? (normalizedConfidence >= 80 ? 'high' : normalizedConfidence >= 60 ? 'medium' : 'low')
      }
    })
    const fallbackRecommendations = [
      {
        id: 'rebalance-eth',
        type: 'rebalance',
        title: 'Increase ETH exposure',
        description: 'Shift 3% from stablecoins into ETH ahead of expected L2 inflows.',
        confidence: Math.max(80, baseConfidence),
        action: 'Review allocation',
        priority: 'high'
      },
      {
        id: 'secure-midnight',
        type: 'security',
        title: 'Rotate Midnight validator keys',
        description: 'Rotate signer keys and refresh secure enclaves before the next epoch rolls over.',
        confidence: Math.max(70, Math.round(baseConfidence * 0.9)),
        action: 'Schedule maintenance',
        priority: 'medium'
      },
      {
        id: 'stable-yield',
        type: 'yield',
        title: 'Deploy idle USDC to yield vault',
        description: 'Allocate 200k USDC into the DEGA-backed stable vault currently earning 5.8% APY.',
        confidence: Math.max(60, Math.round(baseConfidence * 0.8)),
        action: 'Open vault details',
        priority: 'medium'
      }
    ]
    const recommendations = mappedRecommendations.length > 0 ? mappedRecommendations : fallbackRecommendations

    const transactionChanges = data.rebalance?.proposedChanges ?? []
    const mappedTransactions = transactionChanges.map((change, index) => {
      const action = (change.action || '').toString().toLowerCase()
      const amount = Math.abs(change.amountUSD ?? change.amount ?? 0)

      return {
        id: `${change.symbol ?? change.asset}-${index}`,
        date: new Date().toLocaleDateString('en-US'),
  description: `Rebalance ${change.symbol ?? change.asset}`,
        type: action === 'buy' || action === 'increase' ? 'outgoing' : action === 'sell' ? 'incoming' : 'pending',
        amount: Number.isFinite(amount) ? amount : 0,
        asset: change.symbol ?? change.asset ?? 'USDC',
        status: amount > 0 ? 'completed' : 'pending',
        hash: change.transactionHash ?? '—'
      }
    })
    const fallbackTransactions = [
      {
        id: 'txn-restake-lst',
        date: new Date(Date.now() - 3600_000 * 18).toLocaleDateString('en-US'),
        description: 'Restake LST rewards into vault',
        type: 'outgoing',
        amount: 95000,
        asset: 'USDC',
        status: 'completed',
        hash: '0x98e1...aa42'
      },
      {
        id: 'txn-bridge-midnight',
        date: new Date(Date.now() - 3600_000 * 36).toLocaleDateString('en-US'),
        description: 'Bridge MID to Midnight rollup',
        type: 'outgoing',
        amount: 42000,
        asset: 'MID',
        status: 'completed',
        hash: '0x77a3...19de'
      },
      {
        id: 'txn-ai-yield',
        date: new Date(Date.now() - 3600_000 * 60).toLocaleDateString('en-US'),
        description: 'AI yield harvest',
        type: 'incoming',
        amount: 18500,
        asset: 'USDC',
        status: 'completed',
        hash: '0x4c92...54bf'
      },
      {
        id: 'txn-governance-grant',
        date: new Date(Date.now() - 3600_000 * 90).toLocaleDateString('en-US'),
        description: 'Governance grant payout',
        type: 'outgoing',
        amount: 60000,
        asset: 'DAI',
        status: 'pending',
        hash: '0xd1ab...f03c'
      }
    ]
    const transactions = mappedTransactions.length > 0 ? mappedTransactions : fallbackTransactions

    const defaultSigners = [
      { address: '0x1234...5678', signed: true, name: 'Alice' },
      { address: '0x2345...6789', signed: false, name: 'Bob' },
      { address: '0x3456...7890', signed: false, name: 'Carol' }
    ]

    const multiSigSource = transactionChanges.length > 0
      ? transactionChanges.slice(0, 3)
      : Array.isArray(portfolioMetrics.assets) && portfolioMetrics.assets.length > 0
        ? portfolioMetrics.assets.slice(0, 3)
        : DEFAULT_PORTFOLIO.slice(0, 3)
    const mappedMultiSigQueue = multiSigSource.map((item, index) => ({
      id: item.id ?? `proposal-${index}`,
      amount: item.amountUSD ?? item.valueUSD ?? 0,
      asset: item.symbol ?? item.asset ?? 'USDC',
      description: item.description ?? `Allocation adjustment for ${item.symbol ?? item.asset}`,
      requiredSignatures: 3,
      currentSignatures: index % 3 === 0 ? 2 : 1,
      signers: item.signers ?? defaultSigners,
      createdAt: new Date().toLocaleString('en-US'),
      expiresAt: new Date(Date.now() + (index + 1) * 86400000).toLocaleString('en-US')
    }))
    const fallbackMultiSigQueue = [
      {
        id: 'proposal-midnight-bridge',
        amount: 125000,
        asset: 'MID',
        description: 'Authorize bridge to Midnight private rollup',
        requiredSignatures: 3,
        currentSignatures: 2,
        signers: defaultSigners.map((signer, idx) => ({ ...signer, signed: idx < 2 })),
        createdAt: new Date(Date.now() - 3600_000 * 6).toLocaleString('en-US'),
        expiresAt: new Date(Date.now() + 3600_000 * 24).toLocaleString('en-US')
      },
      {
        id: 'proposal-yield-vault',
        amount: 95000,
        asset: 'USDC',
        description: 'Allocate idle USDC into AI yield vault',
        requiredSignatures: 3,
        currentSignatures: 1,
        signers: defaultSigners.map((signer, idx) => ({ ...signer, signed: idx === 0 })),
        createdAt: new Date(Date.now() - 3600_000 * 12).toLocaleString('en-US'),
        expiresAt: new Date(Date.now() + 3600_000 * 36).toLocaleString('en-US')
      },
      {
        id: 'proposal-grant-round',
        amount: 48000,
        asset: 'DEGA',
        description: 'Disburse community grant round 5',
        requiredSignatures: 3,
        currentSignatures: 1,
        signers: defaultSigners.map((signer) => ({ ...signer, signed: signer.name === 'Alice' })),
        createdAt: new Date(Date.now() - 3600_000 * 24).toLocaleString('en-US'),
        expiresAt: new Date(Date.now() + 3600_000 * 48).toLocaleString('en-US')
      }
    ]
    const multiSigQueue = mappedMultiSigQueue.length > 0 ? mappedMultiSigQueue : fallbackMultiSigQueue

    const activeProposals = multiSigQueue.length
    const pendingApprovals = multiSigQueue.filter(
      (item) => item.currentSignatures < item.requiredSignatures
    ).length

    const metrics = [
      {
        id: 'treasury-value',
        title: 'Total Treasury Value',
        value: totalValue > 0 ? `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—',
        change: `${monthlyGrowth.toFixed(1)}%`,
        changeType: monthlyGrowth >= 0 ? 'positive' : 'negative',
        description: 'Monthly growth'
      },
      {
        id: 'risk-score',
        title: 'Risk Score',
        value: typeof riskScore === 'number' ? `${riskScore.toFixed(1)}/100` : String(riskScore),
        change: riskTrend,
        changeType: 'neutral',
        description: 'Portfolio diversification'
      },
      {
        id: 'active-proposals',
        title: 'Active Proposals',
        value: String(activeProposals),
        change: pendingApprovals ? `+${pendingApprovals}` : 'Stable',
        changeType: pendingApprovals > 0 ? 'positive' : 'neutral',
        description: 'Governance votes in progress'
      },
      {
        id: 'performance',
        title: 'Performance 30d',
        value: `${displayPerformance.toFixed(2)}%`,
        change: performanceMetrics?.responseTime?.p95 ? `${performanceMetrics.responseTime.p95}ms p95` : '+0.0%',
        changeType: displayPerformance >= 0 ? 'positive' : 'negative',
        description: 'Benchmark comparison'
      }
    ]

    const opportunities = data.yieldOptimization?.topOpportunities ?? data.yieldOptimization?.opportunities ?? []
    const mappedMarketSignals = opportunities.slice(0, 3).map((op, index) => ({
      id: op.id ?? index,
      asset: op.asset ?? op.protocol ?? '—',
      apy: op.apy ?? op.projectedApy ?? 0,
      description: op.strategy ?? 'Suggested strategy',
      network: op.network ?? 'Multi-chain'
    }))
    const fallbackMarketSignals = [
      {
        id: 'signal-lst-yield',
        asset: 'ETH LST Basket',
        apy: 5.8,
        description: 'Blend Lido & EtherFi deposits for stable ETH yield.',
        network: 'Ethereum'
      },
      {
        id: 'signal-midnight-rollup',
        asset: 'MID Shield Pool',
        apy: 7.2,
        description: 'Stake MID into private rollup liquidity guard.',
        network: 'Midnight'
      },
      {
        id: 'signal-dega-vault',
        asset: 'DEGA Yield Vault',
        apy: 6.4,
        description: 'Deposit DEGA into automated market-making vault.',
        network: 'Cross-chain'
      }
    ]
    const marketSignals = mappedMarketSignals.length > 0 ? mappedMarketSignals : fallbackMarketSignals

    const gasOptimizationData = data.gasOptimization && Object.keys(data.gasOptimization).length > 0
      ? data.gasOptimization
      : {
          Ethereum: {
            savings: 'Estimated 12% fee reduction',
            recommendedGwei: 18,
            optimalTime: '02:00-03:00 UTC'
          },
          Solana: {
            savings: 'Batch transactions for ~8% savings',
            recommendedLamports: 4200,
            optimalTime: '04:15-05:00 UTC'
          },
          Midnight: {
            savings: 'Run shielded transfers in off-peak window',
            optimalTime: '23:00-00:00 UTC'
          }
        }

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
      gas: gasOptimizationData,
      degaStatus: data.degaStatus ?? { status: 'operational' }
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

  useEffect(() => {
    console.info('[Dashboard] derived snapshot', derived)
  }, [derived])

  useEffect(() => {
    console.info('[Dashboard] loading state', loading)
  }, [loading])

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
