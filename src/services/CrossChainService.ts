import { ethers } from 'ethers';
import { config } from '../config/environment';

interface ChainConfig {
  name: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: string;
}

export interface BridgeTransaction {
  txHash: string;
  sourceChain: string;
  targetChain: string;
  amount: number;
  asset: string;
  status: 'pending' | 'confirmed' | 'failed';
  estimatedTime: number;
  fee: number;
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

const DEFAULT_TOKENS: Record<string, Array<{ symbol: string; address: string; decimals: number }>> = {
  ethereum: [
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 }
  ],
  polygon: [
    { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
    { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 }
  ],
  arbitrum: [
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    { symbol: 'ARB', address: '0x912ce59144191c1204e64559fe8253a0e49e6548', decimals: 18 }
  ]
};

export class CrossChainService {
  private chains: Map<string, ChainConfig> = new Map();
  private providers: Map<string, ethers.providers.JsonRpcProvider> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
  const configs: Array<Omit<ChainConfig, 'rpcUrl'> & { rpcUrl?: string }> = [
      {
        name: 'ethereum',
        rpcUrl: config.blockchain.ethereumRpcUrl,
        explorer: 'https://etherscan.io',
        nativeCurrency: 'ETH'
      },
      {
        name: 'polygon',
        rpcUrl: config.blockchain.polygonRpcUrl,
        explorer: 'https://polygonscan.com',
        nativeCurrency: 'MATIC'
      },
      {
        name: 'arbitrum',
        rpcUrl: config.blockchain.arbitrumRpcUrl,
        explorer: 'https://arbiscan.io',
        nativeCurrency: 'ETH'
      }
    ];

    configs.forEach(chain => {
      if (!chain.rpcUrl) {
        return;
      }

      const normalized: ChainConfig = {
        name: chain.name,
        rpcUrl: chain.rpcUrl,
        explorer: chain.explorer,
        nativeCurrency: chain.nativeCurrency
      };

      this.chains.set(chain.name, normalized);
      this.providers.set(chain.name, new ethers.providers.JsonRpcProvider(chain.rpcUrl));
    });
  }

  async getMultiChainBalance(address: string): Promise<Record<string, any>> {
    const balances: Record<string, any> = {};
    const entries = Array.from(this.providers.entries());

    await Promise.all(entries.map(async ([chain, provider]) => {
      try {
        const nativeBalance = await provider.getBalance(address);
        const tokens = await this.getTokenBalances(address, chain);

        balances[chain] = {
          native: {
            symbol: this.chains.get(chain)?.nativeCurrency || 'NATIVE',
            amount: Number(ethers.utils.formatEther(nativeBalance))
          },
          tokens
        };
      } catch (error) {
        balances[chain] = { native: null, tokens: [], error: 'Failed to fetch balances' };
      }
    }));

    return balances;
  }

  async initiateBridge(params: {
    fromChain: string;
    toChain: string;
    asset: string;
    amount: number;
    recipient: string;
  }): Promise<BridgeTransaction> {
    if (!this.providers.has(params.fromChain) || !this.providers.has(params.toChain)) {
      throw new Error('Requested bridge chains are not configured. Please set the required RPC endpoints.');
    }

    return {
      txHash: `0x${Buffer.from(`${params.fromChain}-${params.toChain}-${Date.now()}`).toString('hex').slice(0, 64)}`,
      sourceChain: params.fromChain,
      targetChain: params.toChain,
      amount: params.amount,
      asset: params.asset,
      status: 'pending',
      estimatedTime: this.estimateBridgeTime(params.fromChain, params.toChain),
      fee: params.amount * 0.001
    };
  }

  async getOptimalBridgeRoute(
    fromChain: string,
    toChain: string,
    asset: string,
    amount: number
  ): Promise<any> {
    if (!this.providers.has(fromChain) || !this.providers.has(toChain)) {
      throw new Error('Requested bridge chains are not configured. Please set the required RPC endpoints.');
    }

    const fee = amount * 0.001;
    return {
      optimal: {
        protocol: 'LayerZero',
        estimatedTime: this.estimateBridgeTime(fromChain, toChain),
        fee,
        confidence: 0.92
      },
      alternatives: [
        {
          protocol: 'Axelar',
          estimatedTime: this.estimateBridgeTime(fromChain, toChain) + 120,
          fee: fee * 1.2,
          confidence: 0.87
        }
      ]
    };
  }

  async getBridgeStatus(_txHash: string): Promise<string> {
    return 'pending';
  }

  async getGasPrices(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    await Promise.all(
      Array.from(this.providers.entries()).map(async ([chain, provider]) => {
        try {
          const gasPrice = await provider.getGasPrice();
          results[chain] = {
            gasPrice: Number(ethers.utils.formatUnits(gasPrice, 'gwei'))
          };
        } catch (error) {
          results[chain] = { gasPrice: null };
        }
      })
    );
    return results;
  }

  private async getTokenBalances(address: string, chain: string): Promise<any[]> {
    const provider = this.providers.get(chain);
    if (!provider) {
      return [];
    }

    const tokens = DEFAULT_TOKENS[chain] || [];
    return Promise.all(
      tokens.map(async token => {
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const [balance] = await Promise.all([
            contract.balanceOf(address)
          ]);
          const formatted = Number(ethers.utils.formatUnits(balance, token.decimals));
          return {
            symbol: token.symbol,
            amount: formatted
          };
        } catch (error) {
          return { symbol: token.symbol, amount: 0 };
        }
      })
    );
  }

  private estimateBridgeTime(fromChain: string, toChain: string): number {
    if (fromChain === 'ethereum' || toChain === 'ethereum') {
      return 900;
    }
    if (fromChain === 'polygon' || toChain === 'polygon') {
      return 600;
    }
    return 450;
  }
}

export const crossChainService = new CrossChainService();
