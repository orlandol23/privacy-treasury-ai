'use strict';

function validateEnvironment() {
  const status = {
    midnightNetwork: process.env.MIDNIGHT_NETWORK || 'not-set',
    midnightRpc: Boolean(process.env.MIDNIGHT_RPC_URL),
    proofServer: process.env.PROOF_SERVER_URL || 'http://localhost:6300',
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    llmProvider: process.env.LLM_PROVIDER || 'groq',
    degaMcp: process.env.DEGA_MCP_ENDPOINT || 'not-set',
    degaCommunication: process.env.DEGA_COMMUNICATION_ENDPOINT || 'not-set',
    coingeckoKey: Boolean(process.env.COINGECKO_API_KEY),
    ethereumRpc: Boolean(process.env.ETH_RPC_URL),
    polygonRpc: Boolean(process.env.POLYGON_RPC_URL),
    arbitrumRpc: Boolean(process.env.ARBITRUM_RPC_URL)
  };

  console.log('Environment Validation Summary');
  console.log('--------------------------------');
  console.log(`Midnight Network: ${status.midnightNetwork}`);
  console.log(`Midnight RPC configured: ${status.midnightRpc}`);
  console.log(`Proof Server URL: ${status.proofServer}`);
  console.log(`LLM Provider: ${status.llmProvider}`);
  console.log(`Groq API Key configured: ${status.groqConfigured}`);
  console.log(`DEGA MCP Endpoint: ${status.degaMcp}`);
  console.log(`DEGA Communication Endpoint: ${status.degaCommunication}`);
  console.log(`CoinGecko Key configured: ${status.coingeckoKey}`);
  console.log(`Ethereum RPC configured: ${status.ethereumRpc}`);
  console.log(`Polygon RPC configured: ${status.polygonRpc}`);
  console.log(`Arbitrum RPC configured: ${status.arbitrumRpc}`);

  return status;
}

module.exports = validateEnvironment;

if (require.main === module) {
  validateEnvironment();
}
