# PrivacyTreasuryAI - Frontend

This directory contains the completely redesigned frontend for the PrivacyTreasuryAI project. Built with React, Vite, Tailwind CSS, and shadcn/ui, it provides a modern, responsive user interface aligned with the "privacy-first" design principles established for the DEGA hackathon.

> **Prerequisites**
>
> - Node.js 18 or higher
> - pnpm 8+ (the monorepo uses `pnpm@10` via `packageManager`)
> - PrivacyTreasuryAI backend running (default port `3001`)

## 🚀 Overview

The goal of this frontend is to provide a high-quality user experience (UX) that is:

- **Intuitive**: Facilitating navigation and access to complex DAO treasury information.
- **Informative**: Presenting data clearly and visually appealing through dashboards and charts.
- **Secure**: Reflecting the project's privacy nature with a dark and professional theme.
- **Demo-Ready**: All components and layouts necessary for the hackathon demonstration are included.

### Key Highlights

- 🎨 **Unified design tokens**: Colors, typography, spacing, and shadows centralized in `App.css` to maintain visual consistency.
- 🔄 **Real-time integration**: The `useDashboardData` hook aggregates the main backend endpoints (`/api/analyze-portfolio`, `/api/ai-recommendations`, `/api/ml-optimization`, among others) and applies intelligent retries.
- 📊 **Connected components**: Metrics, charts, transaction tables, and multi-sig queues consume data returned by the backend with loading, error, and partial failure states.
- 🔁 **Continuous updates**: Dashboard data is automatically updated every minute, with a manual refresh button.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion (pre-installed)

## 📂 File Structure

The project structure has been organized to be scalable and easy to maintain:

```
/src
├── assets/           # Images, logos and other static assets
├── components/
│   ├── ui/           # Base shadcn/ui components
│   ├── AIRecommendations.jsx
│   ├── Dashboard.jsx
│   ├── Header.jsx
│   ├── MetricCard.jsx
│   ├── MultiSigApproval.jsx
│   ├── PortfolioChart.jsx
│   ├── Sidebar.jsx
│   └── TransactionTable.jsx
├── hooks/            # Custom hooks (e.g., use-dashboard-data.js)
├── lib/              # Utility functions (e.g., utils.js)
├── services/         # API call logic (consolidated api.js)
├── App.css           # Design System and custom styles
├── App.jsx           # Main component that mounts the layout
└── main.jsx          # Application entry point
```

## ⚙️ Configuration

1. **Install dependencies** (in the monorepo root):

   ```bash
   pnpm install
   ```

2. **Configure environment variables**:

   ```bash
   cd privacy-treasury-frontend
   cp .env.example .env
   ```

   Adjust `VITE_API_BASE_URL` to point to the backend URL (default `http://localhost:3001/api`).

3. **Start the backend** according to the instructions in the project root directory so the dashboard receives real data.

## 🖥️ Running the Frontend

Inside `privacy-treasury-frontend`:

```bash
pnpm run dev
```

Vite will open the application at `http://localhost:5173` (or another available port).

## ✅ Verification and Quality

- **Lint**: `pnpm run lint`
- **Build**: `pnpm run build`

These commands are already configured to run with ESLint 9 and Vite 6.

## 🔄 Data Flow

The `useDashboardData` hook coordinates calls to the main endpoints to build the dashboard state:

- `POST /api/analyze-portfolio`
- `POST /api/ai-recommendations`
- `POST /api/ml-optimization`
- `POST /api/simulate-rebalance`
- `POST /api/risk-assessment`
- `POST /api/yield-optimization`
- `GET /api/system/performance`
- `GET /api/system/health`
- `GET /api/gas-optimization`
- `POST /api/multi-chain-balances`
- `GET /api/game-treasury-analytics/:gameId`
- `GET /api/dega-service-status`

When any of these calls fail, the hook maintains already loaded data, logs the error in `issues`, and the Dashboard displays a non-blocking alert for the operator.

## ✨ Next Steps

Check the `IMPLEMENTATION_GUIDE.md` for a detailed guide on how to integrate this frontend with your existing backend, including code examples and GitHub Copilot prompts.

