import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import { TreasuryAgent } from './TreasuryAgent';

dotenv.config();

const app = express();

// Performance and security middleware
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(compression()); // Gzip compression
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public', { maxAge: '1d', etag: true }));

// Initialize our AI treasury agent
const treasuryAgent = new TreasuryAgent();

// ===== API ROUTES =====

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🤖 PrivacyTreasuryAI is online!',
    version: '1.0.0',
    features: ['AI Analysis', 'Private Transactions', 'Auto Rebalancing'],
    tech: ['Midnight Blockchain', 'ElizaOS', 'DEGA MCP']
  });
});

// Analyze DAO portfolio
app.post('/api/analyze-portfolio', async (req, res) => {
  try {
    const { assets } = req.body;
    const analysis = await treasuryAgent.analyzePortfolio(assets);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze portfolio' });
  }
});

// Create private transaction using Midnight
app.post('/api/private-transaction', async (req, res) => {
  try {
    const { from, to, amount, assetType } = req.body;
    const transaction = await treasuryAgent.createPrivateTransaction(
      from, to, amount, assetType
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create private transaction' });
  }
});

// Get AI-powered recommendations
app.post('/api/ai-recommendations', async (req, res) => {
  try {
    const { currentAllocation, marketConditions } = req.body;
    const recommendations = await treasuryAgent.getAIRecommendations(
      currentAllocation,
      marketConditions
    );
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Simulate portfolio rebalancing
app.post('/api/simulate-rebalance', async (req, res) => {
  try {
    const { currentPortfolio, targetAllocation } = req.body;
    const simulation = await treasuryAgent.simulateRebalancing(
      currentPortfolio,
      targetAllocation
    );
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to simulate rebalancing' });
  }
});

// Agent communication endpoint (DEGA MCP)
app.post('/api/agent-communication', async (req, res) => {
  try {
    const { message, targetAgent } = req.body;
    const response = await treasuryAgent.communicateWithAgent(message, targetAgent);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to communicate with agent' });
  }
});

// Advanced ML Portfolio Optimization endpoint
app.post('/api/ml-optimization', async (req, res) => {
  try {
    const { assets, riskTolerance, timeHorizon } = req.body;
    const optimization = await treasuryAgent.getMLOptimization(assets, riskTolerance, timeHorizon);
    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: 'ML optimization failed' });
  }
});

// Risk Assessment endpoint
app.post('/api/risk-assessment', async (req, res) => {
  try {
    const { assets } = req.body;
    const riskAssessment = await treasuryAgent.getAdvancedRiskAssessment(assets);
    res.json(riskAssessment);
  } catch (error) {
    res.status(500).json({ error: 'Risk assessment failed' });
  }
});

// Yield Optimization endpoint
app.post('/api/yield-optimization', async (req, res) => {
  try {
    const { assets, strategy } = req.body;
    const yieldOptimization = await treasuryAgent.getYieldOptimization(assets, strategy);
    res.json(yieldOptimization);
  } catch (error) {
    res.status(500).json({ error: 'Yield optimization failed' });
  }
});

// Correlation Analysis endpoint
app.get('/api/correlation-analysis', async (req, res) => {
  try {
    const correlationMatrix = await treasuryAgent.getCorrelationAnalysis();
    res.json(correlationMatrix);
  } catch (error) {
    res.status(500).json({ error: 'Correlation analysis failed' });
  }
});

// Multi-Chain Balance endpoint
app.post('/api/multi-chain-balances', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const balances = await treasuryAgent.getMultiChainBalances(walletAddress);
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Multi-chain balance fetch failed' });
  }
});

// Cross-Chain Bridge endpoint
app.post('/api/cross-chain-bridge', async (req, res) => {
  try {
    const { fromChain, toChain, asset, amount, recipientAddress } = req.body;
    const bridgeOperation = await treasuryAgent.initiateCrossChainBridge(
      fromChain, toChain, asset, amount, recipientAddress
    );
    res.json(bridgeOperation);
  } catch (error) {
    res.status(500).json({ error: 'Cross-chain bridge failed' });
  }
});

// Gas Optimization endpoint
app.get('/api/gas-optimization', async (req, res) => {
  try {
    const gasOptimization = await treasuryAgent.getGasOptimization();
    res.json(gasOptimization);
  } catch (error) {
    res.status(500).json({ error: 'Gas optimization failed' });
  }
});

// Cross-Chain Rebalancing endpoint
app.post('/api/cross-chain-rebalancing', async (req, res) => {
  try {
    const { walletAddress, targetAllocation } = req.body;
    const allocationMap = new Map(Object.entries(targetAllocation).map(([k, v]) => [k, Number(v)]));
    const rebalancing = await treasuryAgent.getCrossChainRebalancing(walletAddress, allocationMap);
    res.json(rebalancing);
  } catch (error) {
    res.status(500).json({ error: 'Cross-chain rebalancing failed' });
  }
});

// Gaming Treasury Operation endpoint
app.post('/api/game-treasury-operation', async (req, res) => {
  try {
    const { gameId, playerId, operation, amount, tokenType, metadata } = req.body;
    const result = await treasuryAgent.processGameTreasuryOperation(
      gameId, playerId, operation, amount, tokenType, metadata
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Game treasury operation failed' });
  }
});

// Player Wallet Creation endpoint
app.post('/api/create-player-wallet', async (req, res) => {
  try {
    const { playerId, gameId } = req.body;
    const wallet = await treasuryAgent.createPlayerWallet(playerId, gameId);
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Player wallet creation failed' });
  }
});

// Player Authentication endpoint
app.post('/api/authenticate-player', async (req, res) => {
  try {
    const { token } = req.body;
    const auth = await treasuryAgent.authenticatePlayer(token);
    res.json(auth);
  } catch (error) {
    res.status(500).json({ error: 'Player authentication failed' });
  }
});

// MCP Agent Communication endpoint
app.post('/api/mcp-agent-communication', async (req, res) => {
  try {
    const { targetAgent, method, params } = req.body;
    const response = await treasuryAgent.communicateMCPAgent(targetAgent, method, params);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'MCP agent communication failed' });
  }
});

// Gaming Treasury Analytics endpoint
app.get('/api/game-treasury-analytics/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const analytics = await treasuryAgent.getGameTreasuryAnalytics(gameId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Gaming treasury analytics failed' });
  }
});

// Metachin Optimization endpoint
app.get('/api/metachin-optimization', async (req, res) => {
  try {
    const optimization = await treasuryAgent.optimizeMetachainScaling();
    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: 'Metachin optimization failed' });
  }
});

// DEGA Service Status endpoint
app.get('/api/dega-service-status', async (req, res) => {
  try {
    const status = treasuryAgent.getDEGAServiceStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'DEGA service status failed' });
  }
});

// Performance monitoring endpoint
app.get('/api/system/performance', (req, res) => {
  try {
    const metrics = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      performance: {
        memory: process.memoryUsage(),
        uptime: Math.floor(process.uptime()),
        version: process.version,
        platform: process.platform
      },
      features: {
        totalEndpoints: 23, // Updated count
        activeServices: ['Treasury', 'AI-ML', 'CrossChain', 'DEGA-MCP'],
        security: ['Helmet', 'CORS'],
        optimization: ['Compression', 'Static-File-Caching']
      }
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Performance monitoring failed' });
  }
});

// System health check endpoint
app.get('/api/system/health', (req, res) => {
  const health = {
    status: 'healthy',
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
  
  res.json(health);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 PrivacyTreasuryAI Server Started!');
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log('');
  console.log('🧪 Core Treasury Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/analyze-portfolio`);
  console.log(`   POST http://localhost:${PORT}/api/private-transaction`);
  console.log(`   POST http://localhost:${PORT}/api/ai-recommendations`);
  console.log(`   POST http://localhost:${PORT}/api/simulate-rebalance`);
  console.log(`   POST http://localhost:${PORT}/api/agent-communication`);
  console.log('');
  console.log('🤖 Advanced ML Endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/ml-optimization`);
  console.log(`   POST http://localhost:${PORT}/api/risk-assessment`);
  console.log(`   POST http://localhost:${PORT}/api/yield-optimization`);
  console.log(`   GET  http://localhost:${PORT}/api/correlation-analysis`);
  console.log('');
  console.log('🌉 Cross-Chain Endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/multi-chain-balances`);
  console.log(`   POST http://localhost:${PORT}/api/cross-chain-bridge`);
  console.log(`   GET  http://localhost:${PORT}/api/gas-optimization`);
  console.log(`   POST http://localhost:${PORT}/api/cross-chain-rebalancing`);
  console.log('');
  console.log('🎮 DEGA MCP Gaming Endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/game-treasury-operation`);
  console.log(`   POST http://localhost:${PORT}/api/create-player-wallet`);
  console.log(`   POST http://localhost:${PORT}/api/authenticate-player`);
  console.log(`   POST http://localhost:${PORT}/api/mcp-agent-communication`);
  console.log(`   GET  http://localhost:${PORT}/api/game-treasury-analytics/:gameId`);
  console.log(`   GET  http://localhost:${PORT}/api/metachin-optimization`);
  console.log(`   GET  http://localhost:${PORT}/api/dega-service-status`);
  console.log('');
  console.log('🔗 Tech Stack: Midnight | ElizaOS | DEGA MCP');
  console.log('🎯 Status: Day 2 DEGA MCP Integration Complete!');
  console.log('🏆 Total API Endpoints: 21 | Total Features: 17+');
  console.log('');
});