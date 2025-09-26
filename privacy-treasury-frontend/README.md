# PrivacyTreasuryAI - Frontend

Este diretório contém o frontend completamente redesenhado para o projeto PrivacyTreasuryAI. Construído com React, Vite, Tailwind CSS e shadcn/ui, ele oferece uma interface de usuário moderna, responsiva e alinhada com os princípios de design "privacy-first" definidos para a hackathon DEGA.

> **Pré-requisitos**
>
> - Node.js 18 ou superior
> - pnpm 8+ (o monorepo utiliza `pnpm@10` via `packageManager`)
> - Backend PrivacyTreasuryAI em execução (porta padrão `3001`)

## 🚀 Visão Geral

O objetivo deste frontend é fornecer uma experiência de usuário (UX) de alta qualidade que seja:

- **Intuitiva**: Facilitando a navegação e o acesso a informações complexas sobre o tesouro do DAO.
- **Informativa**: Apresentando dados de forma clara e visualmente atraente através de dashboards e gráficos.
- **Segura**: Refletindo a natureza de privacidade do projeto com um tema escuro e profissional.
- **Pronta para a Demo**: Todos os componentes e layouts necessários para a demonstração da hackathon estão incluídos.

### Principais destaques

- 🎨 **Design tokens unificados**: Cores, tipografia, espaçamento e sombras centralizados em `App.css` para manter consistência visual.
- � **Integração em tempo real**: O hook `useDashboardData` agrega os principais endpoints do backend (`/api/analyze-portfolio`, `/api/ai-recommendations`, `/api/ml-optimization`, entre outros) e aplica retentativas inteligentes.
- 📊 **Componentes conectados**: Métricas, gráficos, tabelas de transações e fila multi-sig consomem os dados retornados pelo backend com estados de carregamento, erro e quedas parciais.
- 🔁 **Atualização contínua**: Os dados do dashboard são atualizados automaticamente a cada minuto, com botão manual de refresh.

## �🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Animações**: Framer Motion (pré-instalado)

## 📂 Estrutura de Arquivos

A estrutura do projeto foi organizada para ser escalável e de fácil manutenção:

```
/src
├── assets/           # Imagens, logos e outros ativos estáticos
├── components/
│   ├── ui/           # Componentes base do shadcn/ui
│   ├── AIRecommendations.jsx
│   ├── Dashboard.jsx
│   ├── Header.jsx
│   ├── MetricCard.jsx
│   ├── MultiSigApproval.jsx
│   ├── PortfolioChart.jsx
│   ├── Sidebar.jsx
│   └── TransactionTable.jsx
├── hooks/            # Hooks customizados (ex: use-dashboard-data.js)
├── lib/              # Funções utilitárias (ex: utils.js)
├── services/         # Lógica de chamada de API (api.js consolidado)
├── App.css           # Design System e estilos customizados
├── App.jsx           # Componente principal que monta o layout
└── main.jsx          # Ponto de entrada da aplicação
```

## ⚙️ Configuração

1. **Instale as dependências** (na raiz do monorepo):

   ```bash
   pnpm install
   ```

2. **Configure as variáveis de ambiente**:

   ```bash
   cd privacy-treasury-frontend
   cp .env.example .env
   ```

   Ajuste `VITE_API_BASE_URL` para apontar para a URL do backend (por padrão `http://localhost:3001/api`).

3. **Inicie o backend** conforme instruções no diretório raiz do projeto para que o dashboard receba dados reais.

## 🖥️ Executando o Frontend

Dentro de `privacy-treasury-frontend`:

```bash
pnpm run dev
```

O Vite abrirá a aplicação em `http://localhost:5173` (ou outra porta disponível).

## ✅ Verificação e Qualidade

- **Lint**: `pnpm run lint`
- **Build**: `pnpm run build`

Esses comandos já estão configurados para rodar com ESLint 9 e Vite 6.

## 🔄 Fluxo de Dados

O hook `useDashboardData` coordena as chamadas aos principais endpoints para montar o estado do dashboard:

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

Quando uma dessas chamadas falha, o hook mantém os dados já carregados, registra o erro em `issues` e o Dashboard exibe um alerta não bloqueante para o operador.

## ✨ Próximos Passos

Consulte o `IMPLEMENTATION_GUIDE.md` para um guia detalhado sobre como integrar este frontend com o seu backend existente, incluindo exemplos de código e prompts para o GitHub Copilot.

