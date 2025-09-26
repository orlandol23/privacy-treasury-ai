import { z } from 'zod';

export const assetSchema = z.object({
  symbol: z.string().min(1, 'Asset symbol is required'),
  amount: z.number().nonnegative().optional().default(0),
  valueUSD: z.number().nonnegative().optional().default(0),
  percentage: z.number().min(0).max(100).optional()
});

const assetsArraySchema = z.array(assetSchema).min(1, 'At least one asset is required');

export const analyzePortfolioSchema = z.object({
  assets: assetsArraySchema
});

export const privateTransactionSchema = z.object({
  from: z.string().min(1, 'Sender address is required'),
  to: z.string().min(1, 'Recipient address is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  assetType: z.string().min(1, 'Asset type is required')
});

const allocationArraySchema = z.array(
  assetSchema.pick({ symbol: true }).merge(
    z.object({
      percentage: z.number().optional(),
      valueUSD: z.number().optional(),
      amount: z.number().optional()
    })
  )
);

const allocationRecordSchema = z.record(z.string(), z.number());

export const aiRecommendationsSchema = z.object({
  currentAllocation: z.union([allocationArraySchema, allocationRecordSchema]),
  marketConditions: z.record(z.string(), z.any()).optional()
});

export const simulateRebalanceSchema = z.object({
  currentPortfolio: assetsArraySchema,
  targetAllocation: z.array(
    z.object({
      symbol: z.string(),
      targetPercentage: z.number().min(0).max(100)
    })
  ).min(1)
});

export const agentCommunicationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  targetAgent: z.string().min(1, 'Target agent is required')
});

export const mlOptimizationSchema = z.object({
  assets: assetsArraySchema.optional(),
  portfolio: assetsArraySchema.optional(),
  riskTolerance: z.number().min(0).max(10).optional(),
  timeHorizon: z.union([z.number(), z.string()]).optional()
}).refine((data) => data.assets || data.portfolio, {
  message: 'Provide assets or portfolio data for optimization'
});

export const riskAssessmentSchema = z.object({
  assets: assetsArraySchema.optional(),
  portfolio: assetsArraySchema.optional()
}).refine((data) => data.assets || data.portfolio, {
  message: 'Provide assets or portfolio data for risk assessment'
});

const yieldAssetSchema = z.union([
  assetSchema,
  z.string().min(1),
  z.object({
    symbol: z.string().min(1),
    amount: z.number().nonnegative().optional(),
    valueUSD: z.number().nonnegative().optional()
  })
]);

export const yieldOptimizationSchema = z.object({
  assets: z.array(yieldAssetSchema).min(1, 'Provide at least one asset'),
  strategy: z.string().optional(),
  riskLevel: z.string().optional(),
  amount: z.number().nonnegative().optional(),
  protocols: z.array(z.string()).optional()
});

export const multiChainBalanceSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required')
});

export const crossChainBridgeSchema = z.object({
  fromChain: z.string().min(1),
  toChain: z.string().min(1),
  asset: z.string().min(1),
  amount: z.number().positive(),
  recipientAddress: z.string().min(1)
});

export const crossChainRebalanceSchema = z.object({
  walletAddress: z.string().min(1),
  targetAllocation: z.union([
    z.record(z.string(), z.number()),
    z.array(
      z.object({
        symbol: z.string(),
        percentage: z.number().min(0).max(100)
      })
    )
  ])
});

export const gameTreasuryOperationSchema = z.object({
  gameId: z.string().min(1),
  playerId: z.string().min(1),
  operation: z.enum(['mint', 'burn', 'transfer', 'stake', 'reward']),
  amount: z.number().positive(),
  tokenType: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional()
});

export const createWalletSchema = z.object({
  playerId: z.string().min(1),
  gameId: z.string().min(1)
});

export const authenticatePlayerSchema = z.object({
  token: z.string().min(1)
});

export const mcpCommunicationSchema = z.object({
  targetAgent: z.string().min(1),
  method: z.string().min(1),
  params: z.unknown().optional()
});