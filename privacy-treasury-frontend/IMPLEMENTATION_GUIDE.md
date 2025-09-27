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

### Step 3: Integrate API Data into the Components

Now that the API service is ready, wire real data into the React components.

1.  **Open `frontend/src/components/Dashboard.jsx`.**

2.  **Use `useState` and `useEffect`** to fetch data when the component mounts. Lean on Copilot if you want help scaffolding the hooks.

    > **GitHub Copilot Prompt (add near the top of `Dashboard.jsx`):**
    > "Import the `api` service. Use the `useState` and `useEffect` hooks to fetch data from the `/api/analyze-portfolio` and `/api/ai-recommendations` endpoints when the component mounts. Store the results in state variables called `portfolioData` and `recommendations`. Add loading and error states as well."

3.  **Pass the fetched data to child components.** For example, provide `portfolioData` to `<PortfolioChart />`.

    ```jsx
    // Example implementation
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.analyzePortfolio({ assets: [...] }); // Provide the required assets
          setPortfolioData(response.data);
        } catch (error) {
          console.error('Failed to fetch portfolio data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Replace with a richer loading component if desired
    }

    return (
      <div className="p-6 space-y-6">
        {/* ...rest of your JSX... */}
        <PortfolioChart data={portfolioData} />
        {/* ... */}
      </div>
    );
    ```

### Step 4: Replace the Legacy Frontend

If the project shipped with an older frontend, configure the server to serve the new React build.

1.  **Update the root `package.json`** (at the project root) so you can install and build both backend and frontend with a single command.

    > **GitHub Copilot Prompt:**
    > "Modify this `package.json` file. Add a `postinstall` script that runs `pnpm install` inside the `frontend` directory. Add a `build` script that runs the build command for both the backend (TypeScript) and the frontend. Add a `start` script that concurrently starts the backend server and the frontend dev server."

2.  **Serve the React build from Express in production.** Add the snippet below to `src/index.ts` after the API routes:

    ```typescript
    import path from 'path';

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../frontend/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
      });
    }
    ```

---

## 🎨 Design System and Best Practices

- **Consistency is Key**: Reuse the utility classes and custom components defined in `App.css` (for example, `treasury-card`, `treasury-button-primary`) to keep the UI cohesive.
- **Responsiveness**: Every component follows a mobile-first approach and leverages Tailwind-style responsive classes (e.g., `md:grid-cols-2`, `lg:col-span-2`).
This guide should provide a solid foundation for you to integrate and build upon the new frontend. Happy development. Good luck with your demo!
