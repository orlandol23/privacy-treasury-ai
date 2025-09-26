# Frontend Implementation Guide - PrivacyTreasuryAI

This guide provides a detailed step-by-step process to replace the existing frontend of your `privacy-treasury-ai` project with the new optimized version, using GitHub Copilot to accelerate the process.

## 🎯 Objective

The goal is to migrate your application to a modern frontend architecture, with a cohesive design system, reusable components, and an enhanced user experience, ready for the hackathon demo.

## 🛠️ Prerequisites

1.  **Node.js and pnpm**: Make sure you have Node.js (v18+) and pnpm installed.
2.  **Git**: Basic Git knowledge to manage changes in your repository.
3.  **GitHub Copilot**: Access to GitHub Copilot in your code editor (VS Code recommended).
4.  **Backend Running**: Your backend (Express API) should be running locally so the frontend can connect to it.

---

## 🚀 Step-by-Step Implementation

### Step 1: Move the New Frontend to Your Repository

1.  **Extract** the `privacy-treasury-frontend.zip` file that was delivered.
2.  **Copy** the contents of the `privacy-treasury-frontend` folder to a new folder called `frontend` in the root of your `privacy-treasury-ai` project.

    Your project structure should look like this:

    ```
    privacy-treasury-ai/
    ├── frontend/         # <-- New frontend here
    ├── src/              # Your Express backend
    ├── package.json      # Backend package.json
    └── ...               # Other backend files
    ```

3.  **Navigate** to the new frontend directory and install dependencies:

    ```bash
    cd frontend
    pnpm install
    ```

### Step 2: Connect Frontend to Backend

The frontend needs to know where your API is running. Let's configure this using environment variables.

1.  **Create a `.env` file** in the `frontend` folder.

2.  **Add your API URL** to the file. By default, your Express API runs on port 3001.

    **File: `frontend/.env`**
    ```
    VITE_API_BASE_URL=http://localhost:3001/api
    ```

3.  **Create an API service** to centralize calls. Use the following prompt with GitHub Copilot to create the `frontend/src/services/api.js` file.

    > **GitHub Copilot Prompt:**
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
This guide should provide a solid foundation for you to integrate and build upon the new frontend. Happy development. Good luck with your demo!
