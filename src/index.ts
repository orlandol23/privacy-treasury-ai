import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TreasuryAgent } from './TreasuryAgent';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 PrivacyTreasuryAI Server Started!');
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log('');
  console.log('🧪 Test endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/analyze-portfolio`);
  console.log(`   POST http://localhost:${PORT}/api/private-transaction`);
  console.log(`   POST http://localhost:${PORT}/api/ai-recommendations`);
  console.log(`   POST http://localhost:${PORT}/api/simulate-rebalance`);
  console.log('');
  console.log('🔗 Tech Stack: Midnight | ElizaOS | DEGA MCP');
  console.log('');
});