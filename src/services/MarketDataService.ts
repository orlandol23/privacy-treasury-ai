import axios from 'axios';
import { ethers } from 'ethers';
import { config } from '../config/environment';

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

export interface YieldOpportunity {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  chain: string;
}

interface CachedPrice {
  data: TokenPrice;
  timestamp: number;
}

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  MATIC: 'matic-network',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  ARB: 'arbitrum'
};

export class MarketDataService {
  private priceCache: Map<string, CachedPrice> = new Map();
  private yieldCache: { data: YieldOpportunity[]; timestamp: number } | null = null;
  private readonly cacheTtl = 60_000; // 1 minute

  async getTokenPrices(symbols: string[]): Promise<Map<string, TokenPrice>> {
    const now = Date.now();
    const results = new Map<string, TokenPrice>();
    const idsToFetch: Set<string> = new Set();

    symbols.forEach(symbol => {
      const id = COINGECKO_IDS[symbol.toUpperCase()];
      if (!id) {
        return;
      }
      const cached = this.priceCache.get(id);
      if (cached && now - cached.timestamp < this.cacheTtl) {
        results.set(symbol.toUpperCase(), cached.data);
      } else {
        idsToFetch.add(id);
      }
    });

    if (idsToFetch.size > 0) {
      await this.fetchPrices(Array.from(idsToFetch));
      idsToFetch.forEach(id => {
        const symbol = Object.keys(COINGECKO_IDS).find(key => COINGECKO_IDS[key] === id);
        const cached = symbol ? this.priceCache.get(id) : undefined;
        if (symbol && cached) {
          results.set(symbol, cached.data);
        }
      });
    }

    return results;
  }

  async getYieldOpportunities(): Promise<YieldOpportunity[]> {
    const now = Date.now();
    if (this.yieldCache && now - this.yieldCache.timestamp < this.cacheTtl) {
      return this.yieldCache.data;
    }

    try {
      const response = await axios.get('https://yields.llama.fi/pools', {
        timeout: 5000
      });

      const data = (response.data?.data || [])
        .slice(0, 25)
        .map((item: any) => ({
          protocol: item.project,
          asset: item.symbol,
          apy: Number(item.apy || 0),
          tvl: Number(item.tvlUsd || 0),
          risk: this.assessRisk(Number(item.apy || 0), item.ilRisk),
          chain: item.chain
        }));

      this.yieldCache = { data, timestamp: now };
      return data;
    } catch (error) {
      if (this.yieldCache) {
        return this.yieldCache.data;
      }
      return this.getFallbackYields();
    }
  }

  async getGasPrices(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    const tasks = [
      this.getEthGasPrice(),
      this.getPolygonGasPrice(),
      this.getArbitrumGasPrice()
    ];

    const [eth, polygon, arbitrum] = await Promise.all(tasks);
    results.ethereum = eth;
    results.polygon = polygon;
    results.arbitrum = arbitrum;
    return results;
  }

  private async fetchPrices(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    try {
      const params = new URLSearchParams({
        ids: ids.join(','),
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
        include_market_cap: 'true'
      });

      const headers: Record<string, string> = {};
      if (config.marketData.coingeckoApiKey) {
        headers['x-cg-pro-api-key'] = config.marketData.coingeckoApiKey;
      }

      const response = await axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?${params.toString()}`, {
        headers,
        timeout: 5000
      });

      const now = Date.now();
      Object.entries(response.data || {}).forEach(([id, payload]: [string, any]) => {
        const symbol = Object.keys(COINGECKO_IDS).find(key => COINGECKO_IDS[key] === id);
        if (!symbol) {
          return;
        }

        const price: TokenPrice = {
          symbol,
          price: Number(payload.usd || 0),
          change24h: Number(payload.usd_24h_change || 0),
          volume24h: Number(payload.usd_24h_vol || 0),
          marketCap: Number(payload.usd_market_cap || 0),
          lastUpdated: now
        };

        this.priceCache.set(id, { data: price, timestamp: now });
      });
    } catch (error) {
      ids.forEach(id => {
        const symbol = Object.keys(COINGECKO_IDS).find(key => COINGECKO_IDS[key] === id);
        if (!symbol) {
          return;
        }
        const fallback = this.getFallbackPrice(symbol);
        this.priceCache.set(id, { data: fallback, timestamp: Date.now() });
      });
    }
  }

  private assessRisk(apy: number, ilRisk?: boolean): 'low' | 'medium' | 'high' {
    if (apy < 5 && !ilRisk) {
      return 'low';
    }
    if (apy < 15) {
      return ilRisk ? 'high' : 'medium';
    }
    return 'high';
  }

  private getFallbackPrice(symbol: string): TokenPrice {
    return {
      symbol,
      price: 1,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }

  private getFallbackYields(): YieldOpportunity[] {
    return [
      { protocol: 'Aave', asset: 'USDC', apy: 3.2, tvl: 450_000_000, risk: 'low', chain: 'ethereum' },
      { protocol: 'Lido', asset: 'stETH', apy: 3.6, tvl: 16_000_000_000, risk: 'low', chain: 'ethereum' },
      { protocol: 'Balancer', asset: 'ETH/USDC', apy: 8.9, tvl: 120_000_000, risk: 'medium', chain: 'ethereum' }
    ];
  }

  private async getEthGasPrice(): Promise<any> {
    try {
      const response = await axios.get('https://api.etherscan.io/api?module=gastracker&action=gasoracle', {
        timeout: 4000
      });
      return response.data?.result || { SafeGasPrice: '15', ProposeGasPrice: '20', FastGasPrice: '25' };
    } catch (error) {
      return { SafeGasPrice: '15', ProposeGasPrice: '20', FastGasPrice: '25' };
    }
  }

  private async getPolygonGasPrice(): Promise<any> {
    try {
      const response = await axios.get('https://gasstation.polygon.technology/v2', { timeout: 4000 });
      return response.data || { safeLow: { maxPriorityFee: 30 }, standard: { maxPriorityFee: 35 } };
    } catch (error) {
      return { safeLow: { maxPriorityFee: 30 }, standard: { maxPriorityFee: 35 } };
    }
  }

  private async getArbitrumGasPrice(): Promise<number> {
    try {
      const ARBITRUM_RPC = process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc';
      const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_RPC);
      const gasPrice = await provider.getGasPrice();
      return Number(ethers.utils.formatUnits(gasPrice, 'gwei'));
    } catch (error) {
      console.error('Arbitrum gas price fetch failed, using estimate:', error);
      return 15;
    }
  }
}

export const marketDataService = new MarketDataService();
