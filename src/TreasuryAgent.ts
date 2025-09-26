import { AIAutomationEngine } from './AIAutomationEngine';
import { CrossChainOrchestrator } from './CrossChainOrchestrator';
import { DEGAMCPService } from './DEGAMCPService';

interface Asset {
  symbol: string;
  amount: number;
  valueUSD: number;
  percentage?: number;
}

interface PortfolioAnalysis {
  totalValueUSD: number;
  assets: Asset[];
  riskScore: number;
  diversificationScore: number;
  recommendations: string[];
  alerts: string[];
  timestamp: string;
}

interface PrivateTransaction {
  transactionId: string;
  status: string;
  type: string;
  zkProof: string;
  publicData: any;
  privateData: any;
  midnightProtocol: boolean;
}

type AssetInput = Asset | (Partial<Asset> & { symbol: string });

export class TreasuryAgent {
  private name: string = "PrivacyTreasuryAI";
  private version: string = "1.0.0";
  private aiEngine: AIAutomationEngine;
  private crossChainOrchestrator: CrossChainOrchestrator;
  private degaMCPService: DEGAMCPService;
  
  constructor() {
    console.log(`✨ ${this.name} Agent v${this.version} initialized`);
    console.log(`🔐 Privacy mode: Enabled (Midnight)`);
    console.log(`🤖 AI Engine: Active (ElizaOS)`);
    this.aiEngine = new AIAutomationEngine();
    this.crossChainOrchestrator = new CrossChainOrchestrator();
    this.degaMCPService = new DEGAMCPService();
  }
  
  // Analyze portfolio and generate insights
  async analyzePortfolio(assets: AssetInput[]): Promise<PortfolioAnalysis> {
    const normalizedAssets = this.normalizeAssetInputs(assets);
    const assetsWithPercentage = this.ensurePercentages(normalizedAssets);
    const totalValueUSD = assetsWithPercentage.reduce((sum, asset) => sum + asset.valueUSD, 0);
    
    // Calculate risk and diversification scores
    const riskScore = this.calculateRiskScore(assetsWithPercentage);
    const diversificationScore = this.calculateDiversificationScore(assetsWithPercentage);
    
    // Generate AI-powered recommendations
    const recommendations = this.generateRecommendations(
      assetsWithPercentage, 
      riskScore, 
      diversificationScore
    );
    
    // Identify critical alerts
    const alerts = this.identifyAlerts(assetsWithPercentage);
    
    return {
      totalValueUSD,
      assets: assetsWithPercentage,
      riskScore,
      diversificationScore,
      recommendations,
      alerts,
      timestamp: new Date().toISOString()
    };
  }
  
  // Create private transaction using Midnight protocol
  async createPrivateTransaction(
    from: string,
    to: string,
    amount: number,
    assetType: string
  ): Promise<PrivateTransaction> {
    // Generate unique transaction ID
    const transactionId = this.generateTransactionId();
    
    // Generate zero-knowledge proof using Midnight
    const zkProof = this.generateZKProof(from, to, amount);
    
    // Create shielded transaction
    return {
      transactionId,
      status: 'pending',
      type: 'shielded',
      zkProof,
      midnightProtocol: true,
      publicData: {
        timestamp: new Date().toISOString(),
        assetType,
        network: 'midnight-testnet',
        privacyLevel: 'full'
      },
      privateData: {
        encrypted: true,
        protocol: 'Midnight ZK-SNARK',
        message: 'Transaction data protected by zero-knowledge proofs'
      }
    };
  }
  
  // Generate AI-powered recommendations
  async getAIRecommendations(
    currentAllocationInput: AssetInput[],
    marketConditions: any
  ) {
    const currentAllocation = this.ensurePercentages(
      this.normalizeAssetInputs(currentAllocationInput)
    );

    // Market analysis
    const marketTrend = marketConditions?.trend || 'neutral';
    const volatility = marketConditions?.volatility || 'medium';
    
    const recommendations = [];
    
    // AI logic for recommendations based on market conditions
    if (marketTrend === 'bearish' && volatility === 'high') {
      recommendations.push({
        action: 'INCREASE_STABLES',
        asset: 'USDC',
        reason: 'High volatility detected, increase stable coin allocation for risk management',
        priority: 'HIGH'
      });
    }
    
    // Check for concentration risk
    const hasConcentrationRisk = currentAllocation.some(a => a.percentage && a.percentage > 50);
    if (hasConcentrationRisk) {
      recommendations.push({
        action: 'DIVERSIFY',
        asset: 'PORTFOLIO',
        reason: 'Concentration risk detected, consider diversifying holdings',
        priority: 'MEDIUM'
      });
    }
    
    // Yield optimization opportunity
    if (marketTrend === 'bullish') {
      recommendations.push({
        action: 'YIELD_FARMING',
        asset: 'ETH',
        reason: 'Bullish market conditions, consider yield farming opportunities',
        priority: 'LOW'
      });
    }
    
    // Default recommendation if no specific actions needed
    if (recommendations.length === 0) {
      recommendations.push({
        action: 'HOLD',
        asset: 'ALL',
        reason: 'Portfolio is well-balanced for current market conditions',
        priority: 'INFO'
      });
    }
    
    return {
      timestamp: new Date().toISOString(),
      marketConditions,
      recommendations,
      confidenceScore: 0.85,
      riskAssessment: volatility === 'high' ? 'ELEVATED' : 'NORMAL',
      aiModel: 'ElizaOS-Treasury-v1',
      nextReviewIn: '24 hours'
    };
  }
  
  // Simulate portfolio rebalancing
  async simulateRebalancing(
    currentPortfolio: AssetInput[],
    targetAllocation: { symbol: string; targetPercentage: number }[]
  ) {
    const portfolio = this.normalizeAssetInputs(currentPortfolio);
    const totalValue = portfolio.reduce((sum, asset) => sum + asset.valueUSD, 0);
    
    // Calculate required changes
    const changes = targetAllocation.map(target => {
  const currentAsset = portfolio.find(a => a.symbol === target.symbol);
      const currentValue = currentAsset?.valueUSD || 0;
      const targetValue = totalValue * (target.targetPercentage / 100);
      const difference = targetValue - currentValue;
      
      return {
        symbol: target.symbol,
        currentValue,
        targetValue,
        difference,
        amountUSD: Math.abs(difference),
        action: difference > 10 ? 'BUY' : difference < -10 ? 'SELL' : 'HOLD'
      };
    });
    
    // Calculate transaction costs (0.3% trading fee estimation)
    const totalTradingVolume = changes.reduce((sum, c) => sum + c.amountUSD, 0) / 2;
    const estimatedTradingFees = totalTradingVolume * 0.003;
    const estimatedGasFees = 50; // Base estimation for Midnight network
    
    // Privacy-preserving execution plan
    return {
      currentTotalValue: totalValue,
      proposedChanges: changes,
      estimatedCosts: {
        tradingFees: estimatedTradingFees,
        gasFees: estimatedGasFees,
        total: estimatedTradingFees + estimatedGasFees,
        percentage: ((estimatedTradingFees + estimatedGasFees) / totalValue * 100).toFixed(3)
      },
      executionPlan: {
        steps: changes.filter(c => c.action !== 'HOLD').length,
        estimatedTime: '5-10 minutes',
        privacyMode: 'shielded',
        protocol: 'Midnight ZK-SNARK'
      },
      recommendation: totalTradingVolume > 1000 
        ? 'Rebalancing recommended - significant portfolio improvement expected' 
        : 'Minor adjustments - consider waiting for larger divergence'
    };
  }
  
  // Agent-to-agent communication (DEGA MCP feature)
  async communicateWithAgent(message: string, targetAgent: string) {
    // Simulate agent communication using DEGA MCP
    return {
      messageId: `msg_${Date.now()}`,
      from: this.name,
      to: targetAgent,
      message,
      protocol: 'DEGA_MCP',
      timestamp: new Date().toISOString(),
      response: `Agent ${targetAgent} acknowledged: Processing treasury operation request`,
      status: 'delivered'
    };
  }
  
  // ===== Private helper methods =====
  
  private calculateRiskScore(assets: Asset[]): number {
    // Higher concentration = higher risk
    const maxPercentage = Math.max(...assets.map(a => a.percentage || 0));
    
    // Risk factors
    const concentrationRisk = maxPercentage > 50 ? 40 : maxPercentage > 30 ? 20 : 0;
    const diversificationBonus = assets.length > 5 ? -10 : assets.length > 3 ? -5 : 0;
    const stableCoinRatio = assets.filter(a => a.symbol.includes('USD')).reduce((sum, a) => sum + (a.percentage || 0), 0);
    const stabilityBonus = stableCoinRatio > 20 ? -15 : 0;
    
    const score = 50 + concentrationRisk + diversificationBonus + stabilityBonus;
    return Math.max(0, Math.min(100, score));
  }
  
  private calculateDiversificationScore(assets: Asset[]): number {
    // Quanto mais ativos e mais balanceado, melhor
    const assetCount = assets.length;
    const balance = 100 - Math.max(...assets.map(a => a.percentage || 0));
    
    // Factors for diversification
    const countBonus = Math.min(assetCount * 10, 40); // Max 40 points for asset count
    const balanceBonus = Math.min(balance, 40); // Max 40 points for balance
    const baseScore = 20; // Base diversification score
    
    const score = baseScore + countBonus + balanceBonus;
    return Math.max(0, Math.min(100, score));
  }
  
  private generateRecommendations(
    assets: Asset[],
    riskScore: number,
    diversificationScore: number
  ): string[] {
    const recommendations: string[] = [];
    
    // Risk-based recommendations
    if (riskScore > 70) {
      recommendations.push("⚠️ High risk detected: Consider reducing exposure to volatile assets");
      recommendations.push("💰 Increase stable coin allocation to reduce portfolio volatility");
    } else if (riskScore < 30) {
      recommendations.push("📈 Low risk portfolio: Consider opportunities for higher yield");
    }
    
    // Diversification recommendations
    if (diversificationScore < 40) {
      recommendations.push("🎯 Poor diversification: Add more assets to spread risk");
      recommendations.push("⚖️ Consider balanced allocation across different asset classes");
    } else if (diversificationScore > 80) {
      recommendations.push("✨ Excellent diversification: Portfolio is well-balanced");
    }
    
    // Asset-specific recommendations
    const ethAsset = assets.find(a => a.symbol === 'ETH');
    if (ethAsset && ethAsset.percentage && ethAsset.percentage > 60) {
      recommendations.push("🔸 ETH concentration risk: Consider reducing ETH allocation below 50%");
    }
    
    const stableCoins = assets.filter(a => a.symbol.includes('USD') || a.symbol.includes('DAI'));
    const stableRatio = stableCoins.reduce((sum, a) => sum + (a.percentage || 0), 0);
    if (stableRatio < 10) {
      recommendations.push("🛡️ Low stable coin ratio: Consider increasing for risk management");
    }
    
    // Default positive recommendation
    if (recommendations.length === 0) {
      recommendations.push("✅ Portfolio looks healthy: Continue monitoring and periodic rebalancing");
    }
    
    return recommendations;
  }
  
  private identifyAlerts(assets: Asset[]): string[] {
    const alerts: string[] = [];
    
    // Check for extreme concentration
    const maxAsset = assets.reduce((max, asset) => 
      (asset.percentage || 0) > (max.percentage || 0) ? asset : max
    );
    
    if (maxAsset.percentage && maxAsset.percentage > 70) {
      alerts.push(`🚨 CRITICAL: ${maxAsset.symbol} represents ${maxAsset.percentage.toFixed(1)}% of portfolio`);
    }
    
    // Check for very small allocations
    const smallAllocations = assets.filter(a => a.percentage && a.percentage < 5);
    if (smallAllocations.length > 3) {
      alerts.push("⚠️ Multiple small positions detected: Consider consolidation");
    }
    
    return alerts;
  }

  private normalizeAssetInputs(assets: AssetInput[]): Asset[] {
    return assets.map(asset => ({
      symbol: asset.symbol,
      amount: asset.amount ?? 0,
      valueUSD: asset.valueUSD ?? 0,
      percentage: asset.percentage
    }));
  }

  private ensurePercentages(assets: Asset[]): Asset[] {
    const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);

    if (totalValue > 0) {
      return assets.map(asset => ({
        ...asset,
        percentage: asset.percentage ?? (asset.valueUSD / totalValue) * 100
      }));
    }

    const allPercentagesProvided = assets.every(
      asset => typeof asset.percentage === 'number'
    );

    if (allPercentagesProvided) {
      return assets;
    }

    const defaultPercentage = assets.length > 0 ? 100 / assets.length : 0;
    return assets.map(asset => ({
      ...asset,
      percentage: asset.percentage ?? defaultPercentage
    }));
  }
  
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateZKProof(from: string, to: string, amount: number): string {
    // Simulação de zero-knowledge proof
    const hash = `${from}_${to}_${amount}_${Date.now()}`;
    return `zk_proof_${Buffer.from(hash).toString('base64').substr(0, 20)}`;
  }

  // Advanced ML Portfolio Optimization
  async getMLOptimization(assets: AssetInput[], riskTolerance: number, timeHorizon: number): Promise<any> {
    try {
      console.log('🧠 Running ML portfolio optimization...');
      const normalizedAssets = this.normalizeAssetInputs(assets);
      const optimization = await this.aiEngine.optimizePortfolio(normalizedAssets, {
        riskTolerance,
        timeHorizon,
        rebalanceFrequency: 'monthly'
      });
      return {
        success: true,
        timestamp: new Date().toISOString(),
        optimization,
        message: 'ML optimization completed successfully'
      };
    } catch (error) {
      console.error('ML optimization error:', error);
      throw error;
    }
  }

  // Advanced Risk Assessment
  async getAdvancedRiskAssessment(assets: AssetInput[]): Promise<any> {
    try {
      console.log('📊 Running advanced risk assessment...');
      const normalizedAssets = this.normalizeAssetInputs(assets);
      const riskAssessment = await this.aiEngine.assessRisk(normalizedAssets);
      return {
        success: true,
        timestamp: new Date().toISOString(),
        riskAssessment,
        message: 'Advanced risk assessment completed'
      };
    } catch (error) {
      console.error('Risk assessment error:', error);
      throw error;
    }
  }

  // Yield Optimization
  async getYieldOptimization(
    assets: Array<AssetInput | string>,
    strategy?: string,
    options: { amount?: number; riskLevel?: string; protocols?: string[] } = {}
  ): Promise<any> {
    try {
      console.log('💰 Running yield optimization...');

      const normalizedAssets = this.normalizeAssetInputs(
        assets.map(asset => (typeof asset === 'string' ? { symbol: asset } : asset))
      );

      const totalValue = normalizedAssets.reduce((sum, asset) => sum + asset.valueUSD, 0);
      if (options.amount && totalValue === 0 && normalizedAssets.length > 0) {
        const perAssetValue = options.amount / normalizedAssets.length;
        normalizedAssets.forEach(asset => {
          asset.valueUSD = perAssetValue;
        });
      }

      const selectedStrategy = strategy
        ?? options.riskLevel?.toLowerCase()
        ?? 'balanced';

      const preparedAssets = this.ensurePercentages(normalizedAssets);

      const yieldOpportunities = await this.aiEngine.optimizeYield(
        preparedAssets,
        selectedStrategy
      );

      return {
        success: true,
        timestamp: new Date().toISOString(),
        yieldOpportunities,
        allocation: preparedAssets,
        strategy: selectedStrategy,
        context: {
          riskLevel: options.riskLevel,
          totalAmount: options.amount,
          protocols: options.protocols
        },
        message: 'Yield optimization completed successfully'
      };
    } catch (error) {
      console.error('Yield optimization error:', error);
      throw error;
    }
  }

  // Correlation Analysis
  async getCorrelationAnalysis(): Promise<any> {
    try {
      console.log('🔗 Running correlation analysis...');
      const correlationMatrix = await this.aiEngine.calculateCorrelationMatrix([
        'BTC', 'ETH', 'USDC', 'DEGA', 'SOL', 'AVAX', 'MATIC', 'DOT'
      ]);
      return {
        success: true,
        timestamp: new Date().toISOString(),
        correlationMatrix,
        message: 'Correlation analysis completed successfully'
      };
    } catch (error) {
      console.error('Correlation analysis error:', error);
      throw error;
    }
  }

  // Multi-Chain Balance Aggregation
  async getMultiChainBalances(walletAddress: string): Promise<any> {
    try {
      console.log('🌉 Fetching multi-chain portfolio balances...');
      const assets = await this.crossChainOrchestrator.getMultiChainBalances(walletAddress);
      const aggregated = this.crossChainOrchestrator.aggregateBalances(assets);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        walletAddress,
        multiChainPortfolio: {
          totalValueUSD: aggregated.totalValueUSD,
          chainsUsed: aggregated.chainsUsed,
          uniqueAssets: aggregated.uniqueAssets,
          diversificationRating: aggregated.diversificationRating,
          assets: aggregated.aggregatedAssets
        },
        message: `Found assets across ${aggregated.chainsUsed} chains`
      };
    } catch (error) {
      console.error('Multi-chain balance error:', error);
      throw error;
    }
  }

  // Cross-Chain Bridge Operations
  async initiateCrossChainBridge(
    fromChain: string,
    toChain: string,
    asset: string,
    amount: number,
    recipientAddress: string
  ): Promise<any> {
    try {
      console.log(`🌉 Initiating cross-chain bridge: ${amount} ${asset} ${fromChain} → ${toChain}`);
      const bridgeOperation = await this.crossChainOrchestrator.initiateBridge(
        fromChain,
        toChain,
        asset,
        amount,
        recipientAddress
      );
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        bridgeOperation,
        message: `Bridge operation initiated: ${bridgeOperation.id}`
      };
    } catch (error) {
      console.error('Cross-chain bridge error:', error);
      throw error;
    }
  }

  // Gas Optimization Across Chains
  async getGasOptimization(): Promise<any> {
    try {
      console.log('⛽ Analyzing gas optimization opportunities...');
      const gasOptimization = await this.crossChainOrchestrator.optimizeGas();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        gasOptimization,
        message: 'Gas optimization analysis completed'
      };
    } catch (error) {
      console.error('Gas optimization error:', error);
      throw error;
    }
  }

  // Cross-Chain Rebalancing
  async getCrossChainRebalancing(
    walletAddress: string,
    targetAllocation: Map<string, number>
  ): Promise<any> {
    try {
      console.log('🔄 Calculating cross-chain rebalancing strategy...');
      const assets = await this.crossChainOrchestrator.getMultiChainBalances(walletAddress);
      const rebalancing = await this.crossChainOrchestrator.rebalanceAcrossChains(
        assets,
        targetAllocation
      );
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        rebalancing,
        message: `Cross-chain rebalancing strategy generated with ${rebalancing.operations.length} operations`
      };
    } catch (error) {
      console.error('Cross-chain rebalancing error:', error);
      throw error;
    }
  }

  // DEGA MCP Gaming Treasury Operations
  async processGameTreasuryOperation(
    gameId: string,
    playerId: string,
    operation: 'mint' | 'burn' | 'transfer' | 'stake' | 'reward',
    amount: number,
    tokenType: string,
    metadata: any = {}
  ): Promise<any> {
    try {
      console.log(`🎮 Processing game treasury operation: ${operation} for player ${playerId}`);
      const result = await this.degaMCPService.processGameTreasuryOperation({
        gameId,
        playerId,
        operation,
        amount,
        tokenType,
        metadata
      });
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        operation: result,
        message: `Game treasury operation ${operation} completed successfully`
      };
    } catch (error) {
      console.error('Game treasury operation error:', error);
      throw error;
    }
  }

  // dAuth Wallet Management
  async createPlayerWallet(playerId: string, gameId: string): Promise<any> {
    try {
      console.log(`🔐 Creating dAuth wallet for player ${playerId} in game ${gameId}`);
      const wallet = await this.degaMCPService.createDAuthWallet(playerId, gameId);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        wallet: {
          walletId: wallet.walletId,
          publicKey: wallet.publicKey,
          gameAssociations: wallet.gameAssociations,
          createdAt: wallet.createdAt
        },
        message: 'dAuth wallet created successfully'
      };
    } catch (error) {
      console.error('Wallet creation error:', error);
      throw error;
    }
  }

  // Player Authentication
  async authenticatePlayer(token: string): Promise<any> {
    try {
      console.log('🔐 Authenticating player with dAuth token...');
      const authResult = await this.degaMCPService.authenticatePlayer(token);
      
      return {
        success: authResult.success,
        timestamp: new Date().toISOString(),
        authentication: authResult,
        message: authResult.success ? 'Player authenticated successfully' : 'Authentication failed'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // MCP Agent Communication
  async communicateMCPAgent(targetAgent: string, method: string, params: any): Promise<any> {
    try {
      console.log(`📡 Communicating with MCP agent: ${targetAgent} - ${method}`);
      const response = await this.degaMCPService.sendMCPMessage(targetAgent, method, params);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        agent: targetAgent,
        method,
        response,
        message: 'MCP communication completed successfully'
      };
    } catch (error) {
      console.error('MCP communication error:', error);
      throw error;
    }
  }

  // Gaming Treasury Analytics
  async getGameTreasuryAnalytics(gameId: string): Promise<any> {
    try {
      console.log(`📊 Generating gaming treasury analytics for ${gameId}`);
      const analytics = await this.degaMCPService.getGameTreasuryAnalytics(gameId);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        analytics,
        message: 'Gaming treasury analytics generated successfully'
      };
    } catch (error) {
      console.error('Gaming analytics error:', error);
      throw error;
    }
  }

  // Metachin Optimization
  async optimizeMetachainScaling(): Promise<any> {
    try {
      console.log('⚡ Optimizing metachin scaling...');
      const optimization = await this.degaMCPService.optimizeMetachainScaling();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        optimization,
        message: 'Metachin scaling optimization completed'
      };
    } catch (error) {
      console.error('Metachin optimization error:', error);
      throw error;
    }
  }

  // DEGA Service Status
  getDEGAServiceStatus(): any {
    try {
      console.log('📊 Retrieving DEGA MCP service status...');
      const status = this.degaMCPService.getServiceStatus();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        status,
        message: 'DEGA MCP service status retrieved successfully'
      };
    } catch (error) {
      console.error('Service status error:', error);
      throw error;
    }
  }
}