// Environment configuration with validation
import dotenv from 'dotenv';

dotenv.config();

// Environment variable validation and type-safe configuration
export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // Blockchain configuration
  blockchain: {
    midnightRpcUrl: process.env.MIDNIGHT_RPC_URL || 'https://testnet.midnight.network',
    degaApiEndpoint: process.env.DEGA_API_ENDPOINT || 'https://api.dega.org',
    ethereumRpcUrl: process.env.ETH_RPC_URL,
    polygonRpcUrl: process.env.POLYGON_RPC_URL,
    arbitrumRpcUrl: process.env.ARBITRUM_RPC_URL
  },

  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dega-treasury-secret-change-in-production',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000']
  },

  // AI Services (optional)
  ai: {
    groqApiKey: process.env.GROQ_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
  },

  // Market data services
  marketData: {
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
    zapperApiKey: process.env.ZAPPER_API_KEY
  },

  // Database (if needed in future)
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10)
  }
};

// Validation function to ensure required environment variables are present
export const validateEnvironment = () => {
  const requiredVars: (keyof typeof process.env)[] = [];
  
  // Add required environment variables here
  if (config.server.isProduction) {
    requiredVars.push('JWT_SECRET');
  }

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }

  console.log('✅ Environment configuration validated');
  
  // Log configuration in development
  if (config.server.isDevelopment) {
    console.log('🔧 Environment Configuration:');
    console.log(`   - Server: ${config.server.nodeEnv} mode on port ${config.server.port}`);
    console.log(`   - Midnight RPC: ${config.blockchain.midnightRpcUrl}`);
    console.log(`   - DEGA API: ${config.blockchain.degaApiEndpoint}`);
    console.log(`   - Ethereum RPC configured: ${Boolean(config.blockchain.ethereumRpcUrl)}`);
    console.log(`   - Polygon RPC configured: ${Boolean(config.blockchain.polygonRpcUrl)}`);
    console.log(`   - Arbitrum RPC configured: ${Boolean(config.blockchain.arbitrumRpcUrl)}`);
    console.log(`   - CoinGecko key configured: ${Boolean(config.marketData.coingeckoApiKey)}`);
    console.log(`   - Groq configured: ${Boolean(config.ai.groqApiKey)}`);
  }
};

export default config;