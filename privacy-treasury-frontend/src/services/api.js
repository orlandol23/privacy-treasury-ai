const DEFAULT_TIMEOUT = 15000;
const DEFAULT_BASE_URL = 'http://localhost:3001/api';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const buildUrl = (baseUrl, path) => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

async function request(path, { method = 'GET', body, signal, headers } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
  const url = path.startsWith('http') ? path : buildUrl(baseUrl, path);

  try {
    const response = await fetch(url, {
      method,
      signal: signal ?? controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const errorPayload = isJson ? await response.json().catch(() => null) : null;
      const message = errorPayload?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    if (!isJson) {
      return null;
    }

    const payload = await response.json();
    if (isObject(payload) && 'success' in payload) {
      if (payload.success === false) {
        throw new Error(payload.message || 'Request failed');
      }
      return payload.data ?? null;
    }

    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  analyzePortfolio: (assets) => request('/analyze-portfolio', { method: 'POST', body: { assets } }),
  aiRecommendations: (currentAllocation, marketConditions) =>
    request('/ai-recommendations', {
      method: 'POST',
      body: { currentAllocation, marketConditions }
    }),
  simulateRebalance: (currentPortfolio, targetAllocation) =>
    request('/simulate-rebalance', {
      method: 'POST',
      body: { currentPortfolio, targetAllocation }
    }),
  mlOptimization: (assets, options) =>
    request('/ml-optimization', {
      method: 'POST',
      body: {
        assets,
        riskTolerance: options?.riskTolerance ?? 5,
        timeHorizon: options?.timeHorizon ?? 12
      }
    }),
  riskAssessment: (assets) => request('/risk-assessment', { method: 'POST', body: { assets } }),
  yieldOptimization: (assets, strategyOptions) =>
    request('/yield-optimization', {
      method: 'POST',
      body: {
        assets,
        strategy: strategyOptions?.strategy ?? 'balanced',
        riskLevel: strategyOptions?.riskLevel ?? 'moderate',
        amount: strategyOptions?.amount ?? 250000,
        protocols: strategyOptions?.protocols ?? ['Lido', 'Aave', 'Uniswap']
      }
    }),
  correlationAnalysis: () => request('/correlation-analysis'),
  multiChainBalances: (walletAddress) =>
    request('/multi-chain-balances', {
      method: 'POST',
      body: { walletAddress }
    }),
  gasOptimization: () => request('/gas-optimization'),
  systemPerformance: () => request('/system/performance'),
  systemHealth: () => request('/system/health'),
  gameTreasuryAnalytics: (gameId) => request(`/game-treasury-analytics/${gameId}`),
  degaServiceStatus: () => request('/dega-service-status')
};

export default apiClient;
