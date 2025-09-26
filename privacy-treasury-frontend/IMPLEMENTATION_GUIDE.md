# Guia de Implementação do Frontend - PrivacyTreasuryAI

Este guia fornece um passo a passo detalhado para substituir o frontend existente do seu projeto `privacy-treasury-ai` pela nova versão otimizada, utilizando o GitHub Copilot para acelerar o processo.

## 🎯 Objetivo

O objetivo é migrar a sua aplicação para uma arquitetura de frontend moderna, com um design system coeso, componentes reutilizáveis e uma experiência de usuário aprimorada, pronta para a demo da hackathon.

## 🛠️ Pré-requisitos

1.  **Node.js e pnpm**: Certifique-se de ter o Node.js (v18+) e o pnpm instalados.
2.  **Git**: Conhecimento básico de Git para gerenciar as alterações no seu repositório.
3.  **GitHub Copilot**: Acesso ao GitHub Copilot no seu editor de código (VS Code recomendado).
4.  **Backend Rodando**: O seu backend (API Express) deve estar rodando localmente para que o frontend possa se conectar a ele.

---

## 🚀 Passo a Passo da Implementação

### Passo 1: Mover o Novo Frontend para o seu Repositório

1.  **Descompacte** o arquivo `privacy-treasury-frontend.zip` que foi entregue.
2.  **Copie** o conteúdo da pasta `privacy-treasury-frontend` para uma nova pasta chamada `frontend` na raiz do seu projeto `privacy-treasury-ai`.

    A sua estrutura de projeto deve ficar assim:

    ```
    privacy-treasury-ai/
    ├── frontend/         # <-- Novo frontend aqui
    ├── src/              # Seu backend Express
    ├── package.json      # package.json do backend
    └── ...               # Outros arquivos do backend
    ```

3.  **Navegue** até o novo diretório do frontend e instale as dependências:

    ```bash
    cd frontend
    pnpm install
    ```

### Passo 2: Conectar o Frontend ao Backend

O frontend precisa saber onde a sua API está rodando. Vamos configurar isso usando variáveis de ambiente.

1.  **Crie um arquivo `.env`** na pasta `frontend`.

2.  **Adicione a URL da sua API** ao arquivo. Por padrão, a sua API Express roda na porta 3001.

    **Arquivo: `frontend/.env`**
    ```
    VITE_API_BASE_URL=http://localhost:3001/api
    ```

3.  **Crie um serviço de API** para centralizar as chamadas. Use o prompt a seguir com o GitHub Copilot para criar o arquivo `frontend/src/services/api.js`.

    > **Prompt para GitHub Copilot:**
    > "Create a JavaScript file that exports an Axios instance. The base URL for Axios should be read from the `VITE_API_BASE_URL` environment variable. Also, export functions for each of the main API endpoints in the backend: `analyze-portfolio`, `ai-recommendations`, `private-transaction`, `ml-optimization`, `risk-assessment`, and `yield-optimization`. Each function should take the required payload as an argument and handle potential errors with a try-catch block, logging the error to the console."

### Passo 3: Integrar os Dados da API nos Componentes

Agora, vamos usar o serviço de API que você criou para buscar dados reais nos componentes React.

1.  **Abra o arquivo `frontend/src/components/Dashboard.jsx`**.

2.  **Use o hook `useState` e `useEffect`** para buscar os dados quando o componente for montado. Peça ao Copilot para ajudá-lo.

    > **Prompt para GitHub Copilot (no topo do componente `Dashboard`):**
    > "Import the `api` service. Use the `useState` and `useEffect` hooks to fetch data from the `/api/analyze-portfolio` and `/api/ai-recommendations` endpoints when the component mounts. Store the results in state variables called `portfolioData` and `recommendations`. Add loading and error states as well."

3.  **Passe os dados do estado para os componentes filhos**. Por exemplo, passe a variável `portfolioData` para o componente `<PortfolioChart />`.

    ```jsx
    // Exemplo de como ficaria
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.analyzePortfolio({ assets: [...] }); // Passe os assets necessários
          setPortfolioData(response.data);
        } catch (error) {
          console.error("Failed to fetch portfolio data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Ou um componente de loading mais sofisticado
    }

    return (
      <div className="p-6 space-y-6">
        {/* ... o resto do seu JSX ... */}
        <PortfolioChart data={portfolioData} />
        {/* ... */}
      </div>
    );
    ```

### Passo 4: Substituir o Frontend Antigo

Se o seu projeto já tinha um frontend, você precisará configurar o seu servidor para servir a nova aplicação React.

1.  **Atualize o seu `package.json` principal** (na raiz do projeto) para instalar e construir ambos os projetos (backend e frontend) com um único comando.

    > **Prompt para GitHub Copilot:**
    > "Modify this `package.json` file. Add a `postinstall` script that runs `pnpm install` inside the `frontend` directory. Add a `build` script that runs the build command for both the backend (TypeScript) and the frontend. Add a `start` script that concurrently starts the backend server and the frontend dev server."

2.  **Configure o Express para servir os arquivos estáticos do React em produção**. No seu arquivo `src/index.ts` (backend), adicione o seguinte:

    ```typescript
    import path from 'path';

    // ... (depois de todas as suas rotas de API)

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../frontend/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
      });
    }
    ```

---

## 🎨 Design System e Boas Práticas

- **Consistência é Chave**: Utilize as classes de utilitários e componentes customizados definidos em `App.css` (ex: `treasury-card`, `treasury-button-primary`). Isso garante que a UI permaneça consistente.
- **Responsividade**: Todos os componentes foram construídos com uma abordagem mobile-first usando as classes responsivas do Tailwind CSS (ex: `md:grid-cols-2`, `lg:col-span-2`).
- **Acessibilidade**: Siga as melhores práticas de acessibilidade, como usar tags semânticas HTML, fornecer atributos `alt` para imagens e garantir que todos os elementos interativos sejam acessíveis via teclado.
- **Animações Sutis**: Use as animações pré-configuradas (`animate-fade-in-up`, `treasury-hover-lift`) para adicionar um toque de profissionalismo sem sobrecarregar o usuário.

## 🔮 Expansão e Customização

- **Adicionar Novas Páginas**: Para adicionar uma nova página (ex: uma página de "Governança"), crie um novo componente em `src/components`, e use uma biblioteca de roteamento como `react-router-dom` para gerenciar a navegação.
- **Customizar o Tema**: Todas as cores e variáveis de design estão centralizadas no topo do arquivo `src/App.css`. Modificar essas variáveis irá atualizar o tema em toda a aplicação.
- **Criar Novos Componentes**: Ao criar novos componentes, siga o estilo dos componentes existentes e use as classes do Tailwind CSS e `shadcn/ui` para manter a consistência visual.

Este guia deve fornecer uma base sólida para você integrar e construir sobre o novo frontend. Bom desenvolvimento. Boa sorte com a sua demo!
