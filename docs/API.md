# 📖 PrivacyTreasuryAI API Documentation

Complete API reference for the PrivacyTreasuryAI system with 23 endpoints across 4 major service categories.

## 🚀 Base URL

```
http://localhost:3001
```

## 🔐 Authentication

Most endpoints are currently open for hackathon demonstration. In production, implement JWT-based authentication:

```javascript
Headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

## 📊 Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-09-26T14:41:11.417Z",
  "version": "1.0.0"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Invalid request payload",
  "details": {
    "fieldErrors": { "assets": ["At least one asset is required"] }
  },
  "timestamp": "2025-09-26T14:41:11.417Z",
  "version": "1.0.0"
}
```

_Endpoint examples below showcase the structure of the `data` object returned inside the success envelope._

---

## 🏛️ Core Treasury Endpoints

### 1. Homepage Status
**`GET /`**

Get system status and basic information.

**Response:**
```json
{
  "message": "🤖 PrivacyTreasuryAI is online!",
  "version": "1.0.0",
  "features": ["AI Analysis", "Private Transactions", "Auto Rebalancing"],
  "tech": ["Midnight Blockchain", "ElizaOS", "DEGA MCP"]
}
```

### 2. Portfolio Analysis
**`POST /api/analyze-portfolio`**

Analyze portfolio composition, risk metrics, and get recommendations.

**Request:**
```json
{
  "assets": [
    {
      "symbol": "ETH",
      "amount": 10,
      "valueUSD": 16000
    },
    {
      "symbol": "USDC",
      "amount": 10000,
      "valueUSD": 10000
    },
    {
      "symbol": "MATIC",
      "amount": 5000,
      "valueUSD": 3500
    }
  ]
}
```

**Response:**
```json
{
  "totalValueUSD": 29500,
  "assets": [
    {
      "symbol": "ETH",
      "amount": 10,
      "valueUSD": 16000,
      "percentage": 54.24
    }
  ],
  "riskScore": 75,
  "diversificationScore": 78.46,
  "recommendations": [
    "⚠️ High risk detected: Consider reducing exposure to volatile assets",
    "💰 Increase stable coin allocation to reduce portfolio volatility",
    "🔸 ETH concentration risk: Consider reducing ETH allocation below 50%"
  ],
  "alerts": [],
  "timestamp": "2025-09-26T14:41:11.417Z"
}
```

### 3. Private Transaction
**`POST /api/private-transaction`**

Create privacy-preserving transactions using Midnight's zero-knowledge proofs.

**Request:**
```json
{
  "from": "0xDAO_Treasury_Address",
  "to": "0xRecipient_Address",
  "amount": 1000,
  "assetType": "USDC"
}
```

**Response:**
```json
{
  "transactionId": "txn_midnight_123",
  "status": "pending",
  "type": "shielded",
  "zkProof": "zk_proof_af83b2d7d9c6f3387",
  "midnightProtocol": true,
  "publicData": {
    "timestamp": "2025-09-26T14:41:11.417Z",
    "assetType": "USDC",
    "network": "midnight-testnet",
    "privacyLevel": "full"
  },
  "privateData": {
    "encrypted": true,
    "protocol": "Midnight ZK-SNARK",
    "message": "Transaction data protected by zero-knowledge proofs"
  }
}
```

### 4. AI Recommendations
**`POST /api/ai-recommendations`**

Get AI-powered portfolio recommendations based on market conditions.

**Request:**
```json
{
  "currentAllocation": {
    "ETH": 60,
    "USDC": 40
  },
  "marketConditions": {
    "volatility": "HIGH",
    "trend": "BULLISH",
    "fear_greed_index": 75,
    "market_cap_change_24h": 2.5
  },
  "riskTolerance": 7,
  "timeHorizon": "6_MONTHS"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "action": "REDUCE_ETH_EXPOSURE",
      "reason": "High volatility detected, reduce risk",
      "priority": "HIGH",
      "expectedImpact": "15% risk reduction"
    },
    {
      "action": "INCREASE_STABLECOIN",
      "reason": "Market uncertainty suggests defensive positioning",
      "priority": "MEDIUM",
      "expectedImpact": "Portfolio stability improvement"
    }
  ],
  "riskAssessment": "MODERATE_HIGH",
  "confidenceScore": 0.87,
  "aiModel": "GPT-4-Treasury-Optimized",
  "nextReviewIn": "24 hours"
}
```

### 5. Simulate Rebalancing
**`POST /api/simulate-rebalance`**

Simulate portfolio rebalancing to target allocation.

**Request:**
```json
{
  "currentPortfolio": [
    {
      "symbol": "ETH",
      "amount": 10,
      "valueUSD": 16000
    },
    {
      "symbol": "USDC",
      "amount": 10000,
      "valueUSD": 10000
    }
  ],
  "targetAllocation": [
    {
      "symbol": "ETH",
      "targetPercentage": 50
    },
    {
      "symbol": "USDC",
      "targetPercentage": 50
    }
  ]
}
```

**Response:**
```json
{
  "currentTotalValue": 26000,
  "proposedChanges": [
    {
      "symbol": "ETH",
      "action": "SELL",
      "amountUSD": 3000,
      "currentValue": 16000,
      "targetValue": 13000
    },
    {
      "symbol": "USDC",
      "action": "BUY",
      "amountUSD": 3000,
      "currentValue": 10000,
      "targetValue": 13000
    }
  ],
  "estimatedCosts": {
    "tradingFees": 15.60,
    "gasFees": 25.40,
    "total": 41.00,
    "percentage": "0.16%"
  },
  "recommendation": "Proceed with rebalancing - low cost and good risk reduction"
}
```

### 6. Agent Communication
**`POST /api/agent-communication`**

Communicate with the ElizaOS treasury agent using natural language.

**Request:**
```json
{
  "message": "What's the best strategy for the current market conditions?",
  "targetAgent": "TreasuryAnalystAgent",
  "context": {
    "portfolioValue": 100000,
    "riskTolerance": "moderate"
  }
}
```

---

## 🤖 Advanced ML Endpoints

### 7. ML Portfolio Optimization
**`POST /api/ml-optimization`**

Optimize portfolio using Modern Portfolio Theory and machine learning.

**Request:**
```json
{
  "portfolio": [
    {
      "symbol": "ETH",
      "amount": 10,
      "valueUSD": 16000,
      "historicalReturns": [0.05, -0.02, 0.08, 0.12, -0.03]
    },
    {
      "symbol": "USDC",
      "amount": 10000,
      "valueUSD": 10000,
      "historicalReturns": [0.01, 0.01, 0.01, 0.01, 0.01]
    }
  ],
  "riskTolerance": 7,
  "timeHorizon": "1_YEAR",
  "optimizationGoal": "SHARPE_RATIO"
}
```

**Response:**
```json
{
  "optimization": {
    "recommendedAllocation": {
      "ETH": 45.5,
      "USDC": 54.5
    },
    "expectedReturn": 8.7,
    "expectedRisk": 12.3,
    "sharpeRatio": 0.71,
    "efficientFrontier": {
      "minRisk": 2.1,
      "maxReturn": 15.4
    }
  },
  "metrics": {
    "currentSharpeRatio": 0.65,
    "optimizedSharpeRatio": 0.71,
    "improvement": "9.2% improvement in risk-adjusted returns"
  }
}
```

### 8. Risk Assessment
**`POST /api/risk-assessment`**

Calculate comprehensive risk metrics including VaR and Expected Shortfall.

**Request:**
```json
{
  "portfolio": [
    {
      "symbol": "ETH",
      "amount": 10,
      "valueUSD": 16000
    }
  ],
  "timeframe": "30_DAYS",
  "confidenceLevel": 95
}
```

**Response:**
```json
{
  "riskAssessment": {
    "concentrationRisk": 0.82,
    "assetRisks": [
      {
        "symbol": "ETH",
        "riskScore": 0.68,
        "allocation": 61.5,
        "contribution": 0.42
      }
    ],
    "portfolioBeta": 1.15,
    "valueAtRisk": {
      "confidence": 0.95,
      "amountUSD": 2340.5
    },
    "expectedShortfall": {
      "confidence": 0.95,
      "amountUSD": 3120.25
    }
  },
  "message": "Advanced risk assessment completed"
}
```

### 9. Yield Optimization
**`POST /api/yield-optimization`**

Find optimal DeFi yield strategies across protocols.

**Request:**
```json
{
  "assets": ["ETH", "USDC", "MATIC"],
  "amount": 50000,
  "riskLevel": "MODERATE",
  "protocols": ["compound", "aave", "curve"]
}
```

**Response:**
```json
{
  "yieldOpportunities": [
    {
      "symbol": "ETH",
      "protocol": "Aave",
      "apy": 0.087,
      "allocationUSD": 20000,
      "riskLevel": "moderate"
    }
  ],
  "allocation": [
    { "symbol": "ETH", "percentage": 40 },
    { "symbol": "USDC", "percentage": 35 },
    { "symbol": "MATIC", "percentage": 25 }
  ],
  "strategy": "moderate",
  "context": {
    "riskLevel": "MODERATE",
    "totalAmount": 50000,
    "protocols": ["compound", "aave", "curve"]
  },
  "message": "Yield optimization completed successfully"
}
```

### 10. Correlation Analysis
**`GET /api/correlation-analysis`**

Get asset correlation matrix for diversification analysis.

**Response:**
```json
{
  "correlationMatrix": {
    "matrix": {
      "ETH": { "ETH": 1.0, "BTC": 0.85, "USDC": -0.05 },
      "BTC": { "ETH": 0.85, "BTC": 1.0, "USDC": -0.02 },
      "USDC": { "ETH": -0.05, "BTC": -0.02, "USDC": 1.0 }
    },
    "diversificationRatio": 0.74
  },
  "message": "Correlation analysis completed successfully"
}
```

---

## 🌉 Cross-Chain Endpoints

### 11. Multi-Chain Balances
**`POST /api/multi-chain-balances`**

Retrieve asset balances across multiple blockchain networks.

**Request:**
```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "chains": ["ethereum", "polygon", "arbitrum", "solana"]
}
```

**Response:**
```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "multiChainPortfolio": {
    "totalValueUSD": 35400,
    "chainsUsed": 3,
    "uniqueAssets": 6,
    "diversificationRating": "A-",
    "assets": [
      {
        "symbol": "ETH",
        "chains": [
          { "chain": "ethereum", "amount": 5.25, "valueUSD": 8400 }
        ]
      }
    ]
  },
  "message": "Found assets across 3 chains"
}
```

### 12. Cross-Chain Bridge
**`POST /api/cross-chain-bridge`**

Execute cross-chain asset transfers with optimization.

**Request:**
```json
{
  "fromChain": "ethereum",
  "toChain": "polygon",
  "asset": "USDC",
  "amount": 1000,
  "recipientAddress": "0x1234567890123456789012345678901234567890",
  "priority": "STANDARD"
}
```

**Response:**
```json
{
  "bridgeOperation": {
    "id": "bridge_123",
    "fromChain": "ethereum",
    "toChain": "polygon",
    "asset": "USDC",
    "amount": 1000,
    "estimatedTime": "15-30 minutes",
    "fees": {
      "bridgeFeeUSD": 5.5,
      "gasFeeUSD": 12.3
    }
  },
  "message": "Bridge operation initiated: bridge_123"
}
```

### 13. Gas Optimization
**`GET /api/gas-optimization`**

Get optimized gas prices across networks.

**Response:**
```json
{
  "gasOptimization": {
    "optimization": {
      "ethereum": {
        "currentGwei": 25,
        "recommendedGwei": 20,
        "savings": "20%",
        "optimalTime": "2:30 PM UTC"
      },
      "polygon": {
        "currentGwei": 35,
        "recommendedGwei": 30,
        "savings": "14%",
        "optimalTime": "3:45 AM UTC"
      }
    },
    "recommendation": "Best time to transact: Arbitrum (now), then Polygon (early morning UTC)",
    "totalSavings": "$12.50 estimated across all chains",
    "timestamp": "2025-09-26T14:41:11.417Z"
  },
  "message": "Gas optimization analysis completed"
}
```

### 14. Cross-Chain Rebalancing
**`POST /api/cross-chain-rebalancing`**

Automated cross-chain portfolio rebalancing.

**Request:**
```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "targetAllocation": {
    "ETH": 40,
    "USDC": 30,
    "SOL": 20,
    "MATIC": 10
  }
}
```

**Response:**
```json
{
  "rebalancing": {
    "operations": [
      {
        "asset": "ETH",
        "action": "BRIDGE",
        "fromChain": "ethereum",
        "toChain": "polygon",
        "amount": 2.5,
        "estimatedFees": 45.20,
        "recommendedChain": "polygon"
      }
    ],
    "estimatedTotalFees": 127.50,
    "estimatedTime": "45-90 minutes",
    "recommendation": "Proceed - significant gas savings vs individual transactions"
  }
}
```

---

## 🎮 DEGA MCP Gaming Endpoints

### 15. Game Treasury Operation
**`POST /api/game-treasury-operation`**

Execute gaming treasury operations (mint, burn, transfer, stake, reward).

**Request:**
```json
{
  "gameId": "dega-rpg-01",
  "playerId": "player123",
  "operation": "mint",
  "amount": 100,
  "tokenType": "DEGA",
  "metadata": {
    "reason": "Level completion reward",
    "level": 5,
    "achievement": "Dragon Slayer"
  }
}
```

**Response:**
```json
{
  "operation": {
    "operationId": "op_mint_001",
    "status": "completed",
    "transactionHash": "0xgame123...",
    "gameId": "dega-rpg-01",
    "playerId": "player123",
    "operation": "mint",
    "amount": 100,
    "tokenType": "DEGA",
    "gasUsed": 45000,
    "timestamp": "2025-09-26T14:41:11.417Z"
  },
  "playerBalance": {
    "before": 150,
    "after": 250,
    "change": 100
  },
  "treasuryStats": {
    "totalMinted": 1500000,
    "circulating": 890000,
    "burned": 45000
  }
}
```

### 16. Create Player Wallet
**`POST /api/create-player-wallet`**

Create dAuth-enabled player wallets with JWT authentication.

**Request:**
```json
{
  "playerId": "newplayer456",
  "gameId": "dega-rpg-01",
  "playerProfile": {
    "username": "DragonSlayer456",
    "email": "player@example.com",
    "level": 1
  }
}
```

**Response:**
```json
{
  "wallet": {
    "walletId": "wallet_dauth_001",
    "walletAddress": "0xplayer456...",
    "playerId": "newplayer456",
    "gameId": "dega-rpg-01",
    "authMethod": "dAuth",
    "status": "active"
  },
  "authentication": {
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_abc123",
    "expiresIn": "24h",
    "tokenType": "Bearer"
  },
  "initialBalance": {
    "DEGA": 0,
    "gameTokens": 100
  }
}
```

### 17. Authenticate Player
**`POST /api/authenticate-player`**

Authenticate players using JWT tokens.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "gameId": "dega-rpg-01"
}
```

**Response:**
```json
{
  "authentication": {
    "valid": true,
    "playerId": "player123",
    "gameId": "dega-rpg-01",
    "walletAddress": "0xplayer123...",
    "permissions": ["PLAY", "TRADE", "STAKE"],
    "sessionId": "session_abc123",
    "expiresAt": "2025-09-27T14:41:11.417Z"
  },
  "playerProfile": {
    "username": "ProGamer123",
    "level": 15,
    "achievements": 28,
    "lastSeen": "2025-09-26T12:30:00.000Z"
  }
}
```

### 18. MCP Agent Communication
**`POST /api/mcp-agent-communication`**

Communicate with MCP agents in the gaming ecosystem.

**Request:**
```json
{
  "targetAgent": "GameAnalyticsAgent",
  "method": "gaming.treasury.balance",
  "params": {
    "playerId": "player123",
    "gameId": "dega-rpg-01",
    "includeHistory": true
  }
}
```

**Response:**
```json
{
  "communication": {
    "messageId": "msg_mcp_001",
    "targetAgent": "GameAnalyticsAgent",
    "method": "gaming.treasury.balance",
    "status": "completed",
    "responseTime": 145,
    "timestamp": "2025-09-26T14:41:11.417Z"
  },
  "agentResponse": {
    "playerBalance": 1250,
    "tokenBreakdown": {
      "DEGA": 1000,
      "gameTokens": 250
    },
    "transactionHistory": [
      {
        "type": "reward",
        "amount": 50,
        "timestamp": "2025-09-26T10:30:00.000Z"
      }
    ]
  }
}
```

### 19. Gaming Analytics  
**`GET /api/game-treasury-analytics/:gameId`**

Retrieve comprehensive gaming analytics for a specific game ID.

**Response:**
```json
{
  "analytics": {
    "totalPlayers": 15420,
    "activePlayers24h": 3240,
    "newPlayers7d": 850,
    "treasuryBalance": 2500000,
    "dailyVolume": 125000,
    "weeklyVolume": 780000,
    "dailyRevenue": 3200,
    "activeSessions": 645,
    "averageSessionTime": "45 minutes",
    "topTransactionTypes": [
      {"type": "rewards", "percentage": 45},
      {"type": "trades", "percentage": 30},
      {"type": "stakes", "percentage": 25}
    ]
  },
  "trends": {
    "playerGrowth": "+12% vs last week",
    "volumeGrowth": "+8% vs last week",
    "revenueGrowth": "-3% vs last week"
  }
}
```

### 20. Metachin Optimization
**`GET /api/metachin-optimization`**

Optimize gaming operations using metachin scaling.

**Response:**
```json
{
  "optimization": {
    "status": "completed",
    "performanceImprovement": 35.7,
    "gasSavings": 23.4,
    "latencyReduction": 150,
    "optimizedChains": ["polygon", "arbitrum", "optimism"],
    "recommendations": [
      "Move high-frequency operations to Polygon",
      "Use Arbitrum for complex game logic",
      "Optimize batch processing for rewards"
    ]
  },
  "metrics": {
    "beforeOptimization": {
      "avgLatency": 450,
      "gasPerTx": 0.045,
      "throughput": 15
    },
    "afterOptimization": {
      "avgLatency": 300,
      "gasPerTx": 0.034,
      "throughput": 25
    }
  }
}
```

### 21. DEGA Service Status
**`GET /api/dega-service-status`**

Check DEGA service status and system health.

**Response:**
```json
{
  "timestamp": "2025-09-26T14:41:11.417Z",
  "status": {
    "service": "DEGA MCP Service",
    "status": "operational",
    "uptime": "99.97%",
    "connections": 1420,
    "operations": 15680,
    "wallets": 8945,
    "metachains": {
      "active": 4,
      "optimized": 3
    },
    "performance": {
      "avgResponseTime": 145,
      "errorRate": 0.03,
      "throughput": 125
    }
  }
}
```

---

## 📊 System Monitoring Endpoints

### 22. System Performance
**`GET /api/system/performance`**

Real-time system performance metrics.

**Response:**
```json
{
  "status": "operational",
  "timestamp": "2025-09-26T14:41:11.417Z",
  "performance": {
    "memory": {
      "rss": 57671680,
      "heapTotal": 29884416,
      "heapUsed": 22156784,
      "external": 1089456,
      "arrayBuffers": 163472
    },
    "uptime": 3600,
    "responseTime": {
      "p50": 42,
      "p95": 118
    },
    "cache": {
      "hits": 128,
      "misses": 24,
      "hitRate": 0.84
    },
    "errorRate": 0.01,
    "node": {
      "version": "v18.17.0",
      "platform": "win32"
    }
  },
  "features": {
    "totalEndpoints": 23,
    "activeServices": ["Treasury", "AI-ML", "CrossChain", "DEGA-MCP"],
    "security": ["Helmet", "CORS"],
    "optimization": ["Compression", "Static-File-Caching"]
  }
}
```

### 23. System Health
**`GET /api/system/health`**

System health check and service status.

**Response:**
```json
{
  "status": "healthy",
  "message": "All systems operational",
  "timestamp": "2025-09-26T14:41:11.417Z",
  "services": {
    "treasury": "operational",
    "aiEngine": "operational",
    "crossChain": "operational", 
    "degaMCP": "operational"
  },
  "version": "1.0.0",
  "uptime": "3600 seconds"
}
```

---

## 🔧 Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Endpoint or resource not found |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server-side error |
| 503  | Service Unavailable - Temporary service issues |

## 📈 Rate Limits

- **General endpoints**: 100 requests/minute
- **AI/ML endpoints**: 20 requests/minute  
- **Gaming operations**: 200 requests/minute
- **System monitoring**: 1000 requests/minute

## 🧪 Testing

Use the provided test scripts:

```bash
# Quick test of core functionality
powershell -ExecutionPolicy Bypass -File quick-test.ps1

# Comprehensive endpoint testing
powershell -ExecutionPolicy Bypass -File test-endpoints.ps1
```

Or use the REST Client file:
```bash
# Load test-api.http in VS Code with REST Client extension
```

## 📞 Support

For API support and questions:
- **GitHub Issues**: [Create an issue](https://github.com/YOUR_USERNAME/privacy-treasury-ai/issues)
- **Email**: support@privacytreasury.ai
- **Documentation**: [Full Docs](https://docs.privacytreasury.ai)

---

**Built for the DEGA Hackathon | PrivacyTreasuryAI v1.0.0**