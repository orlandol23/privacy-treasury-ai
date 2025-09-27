import EventEmitter from 'events';
import axios from 'axios';
import { config } from '../config/environment';
import { marketDataService, TokenPrice } from '../services/MarketDataService';

export interface AnalysisResult {
  totalValue: number;
  riskScore: number;
  diversificationScore: number;
  recommendations: string[];
  alerts: string[];
  opportunities: string[];
  confidence: number;
  metadata: {
    model: string;
    timestamp: string;
    agent: string;
    processingTime: number;
  };
}

export class ElizaAgent extends EventEmitter {
  private readonly model = 'mixtral-8x7b-32768';

  constructor() {
    super();
  }

  async analyzePortfolio(assets: Array<{ symbol: string; amount?: number; valueUSD?: number }>): Promise<AnalysisResult> {
    const start = Date.now();
    const prices = await marketDataService.getTokenPrices(assets.map(asset => asset.symbol));

    const enriched = assets.map(asset => {
      const price = prices.get(asset.symbol.toUpperCase());
      const value = asset.valueUSD ?? (price ? price.price * (asset.amount || 0) : 0);
      return { ...asset, valueUSD: value };
    });

    const totalValue = enriched.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    const riskScore = this.calculateRiskScore(enriched);
    const diversificationScore = this.calculateDiversificationScore(enriched);
    const alerts = this.identifyAlerts(enriched);
    const opportunities = await this.identifyOpportunities(enriched);
    const recommendations = await this.generateRecommendations(enriched, riskScore, diversificationScore);

    return {
      totalValue,
      riskScore,
      diversificationScore,
      alerts,
      opportunities,
      recommendations,
      confidence: 0.82,
      metadata: {
        model: this.model,
        timestamp: new Date().toISOString(),
        agent: 'PrivacyTreasuryAI::ElizaAgent',
        processingTime: Date.now() - start
      }
    };
  }

  async processQuery(query: string): Promise<string> {
    const response = await this.callGroq([{ role: 'user', content: query }]);
    return response || 'Unable to retrieve an answer at this time.';
  }

  private async generateRecommendations(assets: any[], riskScore: number, diversificationScore: number): Promise<string[]> {
    const systemPrompt = `You are PrivacyTreasuryAI, an expert DAO treasury analyst. Provide concise, actionable recommendations (max 4 sentences) about diversification, risk mitigation, and yield opportunities.`;

    const assetSummary = assets
      .map(asset => `${asset.symbol}: $${(asset.valueUSD || 0).toFixed(2)}`)
      .join(', ');

    const userPrompt = `Portfolio Summary: ${assetSummary}.
Risk Score: ${riskScore}/100. Diversification Score: ${diversificationScore}/100.
Provide 3 bullet recommendations.`;

    const content = await this.callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    if (!content) {
      return [
        'Rebalance large single-asset exposures to keep any single holding below 40% of the treasury.',
        'Allocate a portion of idle stablecoins into low-risk yield strategies (Aave, Compound) to improve capital efficiency.',
        'Schedule a monthly review to adjust allocation based on DAO governance roadmap and market volatility.'
      ];
    }

    return content
      .split('\n')
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  private async identifyOpportunities(assets: any[]): Promise<string[]> {
    const yields = await marketDataService.getYieldOpportunities();
    const stableExposure = this.calculateStablePercentage(assets);

    const top = yields
      .filter(item => item.risk !== 'high')
      .slice(0, 3)
      .map(item => `${item.protocol} ${item.asset} on ${item.chain}: ${(item.apy || 0).toFixed(2)}% APY`);

    if (stableExposure > 40 && top.length > 0) {
      top.unshift('Stablecoin allocation is strong—deploy a portion into the following low-risk opportunities:');
    }

    return top;
  }

  private identifyAlerts(assets: any[]): string[] {
    const alerts: string[] = [];
    const total = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    if (total === 0) {
      return ['Portfolio has zero recorded value—verify asset balances.'];
    }

    assets.forEach(asset => {
      const ratio = (asset.valueUSD || 0) / total;
      if (ratio > 0.55) {
        alerts.push(`Concentration risk: ${asset.symbol} is ${(ratio * 100).toFixed(1)}% of treasury.`);
      }
    });

    if (this.calculateStablePercentage(assets) < 10) {
      alerts.push('Stablecoin coverage below 10%—consider increasing reserves for runway protection.');
    }

    return alerts;
  }

  private calculateRiskScore(assets: any[]): number {
    const total = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    if (total === 0) {
      return 0;
    }

    const concentration = Math.max(...assets.map(asset => (asset.valueUSD || 0) / total));
    const stableRatio = this.calculateStablePercentage(assets) / 100;

    let score = 50 + concentration * 40 - stableRatio * 20;
    score = Math.min(100, Math.max(0, score));
    return Number(score.toFixed(2));
  }

  private calculateDiversificationScore(assets: any[]): number {
    const total = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    if (total === 0) {
      return 0;
    }

    const weights = assets.map(asset => (asset.valueUSD || 0) / total);
    const herfindahl = weights.reduce((sum, weight) => sum + weight * weight, 0);
    return Number(((1 - herfindahl) * 100).toFixed(2));
  }

  private calculateStablePercentage(assets: any[]): number {
    const total = assets.reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);
    if (total === 0) {
      return 0;
    }

    const stable = assets
      .filter(asset => ['USDC', 'USDT', 'DAI', 'USDS', 'PYUSD'].includes(asset.symbol?.toUpperCase()))
      .reduce((sum, asset) => sum + (asset.valueUSD || 0), 0);

    return Number(((stable / total) * 100).toFixed(2));
  }

  private async callGroq(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<string | null> {
    if (!config.ai.groqApiKey) {
      return null;
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: this.model,
          messages,
          temperature: 0.3,
          max_tokens: 400
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.ai.groqApiKey}`
          },
          timeout: 10_000
        }
      );

      return response.data?.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      return null;
    }
  }
}

export const elizaAgent = new ElizaAgent();
