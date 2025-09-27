import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { TreasuryAgent } from './TreasuryAgent';
import { enhancedPerformanceMiddleware, performanceMonitor } from './performance/monitor';
import {
  cacheMiddleware,
  performanceMiddleware as requestPerformanceMiddleware
} from './performance/optimization';
import { sendError, sendSuccess, sendValidationError } from './utils/http';
import {
  analyzePortfolioSchema,
  privateTransactionSchema,
  aiRecommendationsSchema,
  simulateRebalanceSchema,
  agentCommunicationSchema,
  mlOptimizationSchema,
  riskAssessmentSchema,
  yieldOptimizationSchema,
  multiChainBalanceSchema,
  crossChainBridgeSchema,
  crossChainRebalanceSchema,
  gameTreasuryOperationSchema,
  createWalletSchema,
  authenticatePlayerSchema,
  mcpCommunicationSchema
} from './utils/validation';
import config, { validateEnvironment } from './config/environment';

// Validate environment configuration
validateEnvironment();

const app = express();

// --- FIRST THING: configure CORS ---
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Important: preflight handler
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Performance and security middleware
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(compression()); // Gzip compression
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  index: false
}));
app.use(requestPerformanceMiddleware);
app.use(enhancedPerformanceMiddleware);

// Initialize our AI treasury agent
const treasuryAgent = new TreasuryAgent();

const shortCache = cacheMiddleware(120000); // 2 minutes
const mediumCache = cacheMiddleware(300000); // 5 minutes
const telemetryCache = cacheMiddleware(30000); // 30 seconds

const parseTimeHorizon = (value: number | string | undefined): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    const match = lower.match(/(\d+(\.\d+)?)/);
    if (match) {
      const quantity = Number(match[1]);
      if (lower.includes('year')) {
        return Math.round(quantity * 12);
      }
      if (lower.includes('month')) {
        return Math.round(quantity);
      }
    }
  }

  return 12; // default 12 months
};

// ===== API ROUTES =====

// Analyze DAO portfolio
app.post('/api/analyze-portfolio', async (req, res) => {
  try {
    const parsed = analyzePortfolioSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { assets } = parsed.data;
    const analysis = await treasuryAgent.analyzePortfolio(assets);
    return sendSuccess(res, analysis);
  } catch (error) {
    return sendError(res, error, 'Failed to analyze portfolio');
  }
});

// Create private transaction using Midnight
app.post('/api/private-transaction', async (req, res) => {
  try {
    const parsed = privateTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { from, to, amount, assetType } = parsed.data;
    const transaction = await treasuryAgent.createPrivateTransaction(
      from, to, amount, assetType
    );
    return sendSuccess(res, transaction);
  } catch (error) {
    return sendError(res, error, 'Failed to create private transaction');
  }
});

// Get AI-powered recommendations
app.post('/api/ai-recommendations', async (req, res) => {
  try {
    const parsed = aiRecommendationsSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { currentAllocation, marketConditions } = parsed.data;
    const allocationArray = Array.isArray(currentAllocation)
      ? currentAllocation.map(asset => ({
          symbol: asset.symbol,
          amount: asset.amount ?? 0,
          valueUSD: asset.valueUSD ?? 0,
          percentage: asset.percentage
        }))
      : Object.entries(currentAllocation).map(([symbol, percentage]) => ({
          symbol,
          amount: 0,
          valueUSD: 0,
          percentage
        }));

    const recommendations = await treasuryAgent.getAIRecommendations(
      allocationArray,
      marketConditions ?? {}
    );
    return sendSuccess(res, recommendations);
  } catch (error) {
    return sendError(res, error, 'Failed to generate recommendations');
  }
});

// Simulate portfolio rebalancing
app.post('/api/simulate-rebalance', async (req, res) => {
  try {
    const parsed = simulateRebalanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { currentPortfolio, targetAllocation } = parsed.data;
    const simulation = await treasuryAgent.simulateRebalancing(
      currentPortfolio,
      targetAllocation
    );
    return sendSuccess(res, simulation);
  } catch (error) {
    return sendError(res, error, 'Failed to simulate rebalancing');
  }
});

// Agent communication endpoint (DEGA MCP)
app.post('/api/agent-communication', async (req, res) => {
  try {
    const parsed = agentCommunicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { message, targetAgent } = parsed.data;
    const response = await treasuryAgent.communicateWithAgent(message, targetAgent);
    return sendSuccess(res, response);
  } catch (error) {
    return sendError(res, error, 'Failed to communicate with agent');
  }
});

// Advanced ML Portfolio Optimization endpoint
app.post('/api/ml-optimization', async (req, res) => {
  try {
    const parsed = mlOptimizationSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const {
      assets,
      portfolio,
      riskTolerance = 5,
      timeHorizon
    } = parsed.data;

    const selectedAssets = assets ?? portfolio ?? [];
    const normalizedRiskTolerance = typeof riskTolerance === 'number' ? riskTolerance : 5;
    const normalizedTimeHorizon = parseTimeHorizon(timeHorizon);

    const optimization = await treasuryAgent.getMLOptimization(
      selectedAssets,
      normalizedRiskTolerance,
      normalizedTimeHorizon
    );
    return sendSuccess(res, optimization);
  } catch (error) {
    return sendError(res, error, 'ML optimization failed');
  }
});

// Risk Assessment endpoint
app.post('/api/risk-assessment', async (req, res) => {
  try {
    const parsed = riskAssessmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { assets, portfolio } = parsed.data;
    const selectedAssets = assets ?? portfolio ?? [];
    const riskAssessment = await treasuryAgent.getAdvancedRiskAssessment(selectedAssets);
    return sendSuccess(res, riskAssessment);
  } catch (error) {
    return sendError(res, error, 'Risk assessment failed');
  }
});

// Yield Optimization endpoint
app.post('/api/yield-optimization', async (req, res) => {
  try {
    const parsed = yieldOptimizationSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { assets: rawAssets, strategy, riskLevel, amount, protocols } = parsed.data;
    const normalizedAssets = rawAssets.map(asset => {
      if (typeof asset === 'string') {
        return asset;
      }

      return {
        symbol: asset.symbol,
        amount: 'amount' in asset && asset.amount !== undefined ? asset.amount : 0,
        valueUSD: 'valueUSD' in asset && asset.valueUSD !== undefined ? asset.valueUSD : 0,
        percentage: 'percentage' in asset ? (asset as any).percentage : undefined
      };
    });

    const yieldOptimization = await treasuryAgent.getYieldOptimization(
      normalizedAssets,
      strategy,
      { amount, riskLevel, protocols }
    );
    return sendSuccess(res, yieldOptimization);
  } catch (error) {
    return sendError(res, error, 'Yield optimization failed');
  }
});

// Correlation Analysis endpoint
app.get('/api/correlation-analysis', mediumCache, async (req, res) => {
  try {
    const correlationMatrix = await treasuryAgent.getCorrelationAnalysis();
    return sendSuccess(res, correlationMatrix);
  } catch (error) {
    return sendError(res, error, 'Correlation analysis failed');
  }
});

// Multi-Chain Balance endpoint
app.post('/api/multi-chain-balances', async (req, res) => {
  try {
    const parsed = multiChainBalanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { walletAddress } = parsed.data;
    const balances = await treasuryAgent.getMultiChainBalances(walletAddress);
    return sendSuccess(res, balances);
  } catch (error) {
    return sendError(res, error, 'Multi-chain balance fetch failed');
  }
});

// Cross-Chain Bridge endpoint
app.post('/api/cross-chain-bridge', async (req, res) => {
  try {
    const parsed = crossChainBridgeSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { fromChain, toChain, asset, amount, recipientAddress } = parsed.data;
    const bridgeOperation = await treasuryAgent.initiateCrossChainBridge(
      fromChain, toChain, asset, amount, recipientAddress
    );
    return sendSuccess(res, bridgeOperation);
  } catch (error) {
    return sendError(res, error, 'Cross-chain bridge failed');
  }
});

// Gas Optimization endpoint
app.get('/api/gas-optimization', shortCache, async (req, res) => {
  try {
    const gasOptimization = await treasuryAgent.getGasOptimization();
    return sendSuccess(res, gasOptimization);
  } catch (error) {
    return sendError(res, error, 'Gas optimization failed');
  }
});

// Cross-Chain Rebalancing endpoint
app.post('/api/cross-chain-rebalancing', async (req, res) => {
  try {
    const parsed = crossChainRebalanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { walletAddress, targetAllocation } = parsed.data;
    const allocationMap = Array.isArray(targetAllocation)
      ? new Map(targetAllocation.map(item => [item.symbol, item.percentage]))
      : new Map(Object.entries(targetAllocation));
    const rebalancing = await treasuryAgent.getCrossChainRebalancing(walletAddress, allocationMap);
    return sendSuccess(res, rebalancing);
  } catch (error) {
    return sendError(res, error, 'Cross-chain rebalancing failed');
  }
});

// Gaming Treasury Operation endpoint
app.post('/api/game-treasury-operation', async (req, res) => {
  try {
    const parsed = gameTreasuryOperationSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { gameId, playerId, operation, amount, tokenType, metadata } = parsed.data;
    const result = await treasuryAgent.processGameTreasuryOperation(
      gameId, playerId, operation, amount, tokenType, metadata
    );
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error, 'Game treasury operation failed');
  }
});

// Player Wallet Creation endpoint
app.post('/api/create-player-wallet', async (req, res) => {
  try {
    const parsed = createWalletSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { playerId, gameId } = parsed.data;
    const wallet = await treasuryAgent.createPlayerWallet(playerId, gameId);
    return sendSuccess(res, wallet);
  } catch (error) {
    return sendError(res, error, 'Player wallet creation failed');
  }
});

// Player Authentication endpoint
app.post('/api/authenticate-player', async (req, res) => {
  try {
    const parsed = authenticatePlayerSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { token } = parsed.data;
    const auth = await treasuryAgent.authenticatePlayer(token);
    return sendSuccess(res, auth);
  } catch (error) {
    return sendError(res, error, 'Player authentication failed');
  }
});

// MCP Agent Communication endpoint
app.post('/api/mcp-agent-communication', async (req, res) => {
  try {
    const parsed = mcpCommunicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const { targetAgent, method, params } = parsed.data;
    const response = await treasuryAgent.communicateMCPAgent(targetAgent, method, params);
    return sendSuccess(res, response);
  } catch (error) {
    return sendError(res, error, 'MCP agent communication failed');
  }
});

// Gaming Treasury Analytics endpoint
app.get('/api/game-treasury-analytics/:gameId', shortCache, async (req, res) => {
  try {
    const { gameId } = req.params;
    const analytics = await treasuryAgent.getGameTreasuryAnalytics(gameId);
    return sendSuccess(res, analytics);
  } catch (error) {
    return sendError(res, error, 'Gaming treasury analytics failed');
  }
});

// Metachin Optimization endpoint
app.get('/api/metachin-optimization', shortCache, async (req, res) => {
  try {
    const optimization = await treasuryAgent.optimizeMetachainScaling();
    return sendSuccess(res, optimization);
  } catch (error) {
    return sendError(res, error, 'Metachin optimization failed');
  }
});

// DEGA Service Status endpoint
app.get('/api/dega-service-status', shortCache, async (req, res) => {
  try {
    const status = treasuryAgent.getDEGAServiceStatus();
    return sendSuccess(res, status);
  } catch (error) {
    return sendError(res, error, 'DEGA service status failed');
  }
});

// Performance monitoring endpoint
app.get('/api/system/performance', telemetryCache, (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    return sendSuccess(res, {
      status: metrics.systemHealth,
      timestamp: new Date().toISOString(),
      performance: {
        memory: metrics.memory,
        uptime: metrics.uptime,
        responseTime: metrics.responseTime,
        cache: metrics.cacheStats,
        errorRate: metrics.errorRate,
        node: {
          version: process.version,
          platform: process.platform
        }
      },
      features: {
        totalEndpoints: 23,
        activeServices: ['Treasury', 'AI-ML', 'CrossChain', 'DEGA-MCP'],
        security: ['Helmet', 'CORS'],
        optimization: ['Compression', 'Static-File-Caching', 'Adaptive-Caching']
      }
    });
  } catch (error) {
    return sendError(res, error, 'Performance monitoring failed');
  }
});

// System health check endpoint
app.get('/api/system/health', telemetryCache, (req, res) => {
  const healthStatus = performanceMonitor.getHealthStatus();
  const health = {
    status: healthStatus.status,
    message: healthStatus.message,
    timestamp: new Date().toISOString(),
    services: {
      treasury: 'operational',
      aiEngine: 'operational', 
      crossChain: 'operational',
      degaMCP: 'operational'
    },
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())} seconds`
  };
  
  return sendSuccess(res, health);
});

// Homepage route should be registered after API routes
app.get('/', (req, res) => {
  return sendSuccess(res, {
    message: '🤖 PrivacyTreasuryAI is online!',
    features: ['AI Analysis', 'Private Transactions', 'Auto Rebalancing'],
    tech: ['Midnight Blockchain', 'ElizaOS', 'DEGA MCP']
  });
});

app.listen(config.server.port, () => {
  console.log('');
  console.log('🚀 PrivacyTreasuryAI Server Started!');
  console.log(`📡 API available at: http://localhost:${config.server.port}`);
  console.log('');
  console.log('🧪 Core Treasury Endpoints:');
  console.log(`   GET  http://localhost:${config.server.port}/`);
  console.log(`   POST http://localhost:${config.server.port}/api/analyze-portfolio`);
  console.log(`   POST http://localhost:${config.server.port}/api/private-transaction`);
  console.log(`   POST http://localhost:${config.server.port}/api/ai-recommendations`);
  console.log(`   POST http://localhost:${config.server.port}/api/simulate-rebalance`);
  console.log(`   POST http://localhost:${config.server.port}/api/agent-communication`);
  console.log('');
  console.log('🤖 Advanced ML Endpoints:');
  console.log(`   POST http://localhost:${config.server.port}/api/ml-optimization`);
  console.log(`   POST http://localhost:${config.server.port}/api/risk-assessment`);
  console.log(`   POST http://localhost:${config.server.port}/api/yield-optimization`);
  console.log(`   GET  http://localhost:${config.server.port}/api/correlation-analysis`);
  console.log('');
  console.log('🌉 Cross-Chain Endpoints:');
  console.log(`   POST http://localhost:${config.server.port}/api/multi-chain-balances`);
  console.log(`   POST http://localhost:${config.server.port}/api/cross-chain-bridge`);
  console.log(`   GET  http://localhost:${config.server.port}/api/gas-optimization`);
  console.log(`   POST http://localhost:${config.server.port}/api/cross-chain-rebalancing`);
  console.log('');
  console.log('🎮 DEGA MCP Gaming Endpoints:');
  console.log(`   POST http://localhost:${config.server.port}/api/game-treasury-operation`);
  console.log(`   POST http://localhost:${config.server.port}/api/create-player-wallet`);
  console.log(`   POST http://localhost:${config.server.port}/api/authenticate-player`);
  console.log(`   POST http://localhost:${config.server.port}/api/mcp-agent-communication`);
  console.log(`   GET  http://localhost:${config.server.port}/api/game-treasury-analytics/:gameId`);
  console.log(`   GET  http://localhost:${config.server.port}/api/metachin-optimization`);
  console.log(`   GET  http://localhost:${config.server.port}/api/dega-service-status`);
  console.log('');
  console.log('🔗 Tech Stack: Midnight | ElizaOS | DEGA MCP');
  console.log('🎯 Status: Day 2 DEGA MCP Integration Complete!');
  console.log('🏆 Total API Endpoints: 23 | Total Features: 17+');
  console.log('');
});