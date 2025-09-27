# Demo Readiness Checklist

Use this checklist to verify the project is ready for the demo.

## Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MIDNIGHT_NETWORK`, `MIDNIGHT_RPC_URL`, and `PROOF_SERVER_URL`
- [ ] Provide `GROQ_API_KEY` (required) and optional `OPENAI_API_KEY`
- [ ] Configure DEGA endpoints (`DEGA_MCP_ENDPOINT`, `DEGA_COMMUNICATION_ENDPOINT`)
- [ ] Populate blockchain RPC URLs (`ETH_RPC_URL`, `POLYGON_RPC_URL`, `ARBITRUM_RPC_URL`)
- [ ] Run `node src/utils/validateEnvironment.js` and confirm all required entries are present

## Backend
- [ ] Install dependencies: `pnpm install`
- [ ] Start the service: `pnpm dev`
- [ ] Verify `/health` endpoint responds 200
- [ ] Check Midnight connectivity using `MIDNIGHT_RPC_URL`
- [ ] Confirm DEGA MCP handshake succeeds

## Frontend
- [ ] `cd privacy-treasury-frontend`
- [ ] Install dependencies: `pnpm install`
- [ ] Start the UI: `pnpm dev`
- [ ] Confirm dashboard renders metrics, gas prices, and AI recommendations

## Demo Script Highlights
- [ ] Show Groq powered AI recommendation flow
- [ ] Demonstrate cross-chain treasury metrics
- [ ] Review multisig approval workflow
- [ ] Outline Midnight shielded treasury concept (reference `contracts/DAOTreasury.compact`)

## Post-Demo Artifacts
- [ ] Capture screenshots or recording
- [ ] Update README with final demo notes
- [ ] Archive `.env` values securely
