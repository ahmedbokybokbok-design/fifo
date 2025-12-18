# DawaaConnect (دواء كونكت)

A B2B platform connecting pharmacies and drug warehouses for real-time price comparison, order management, and dead stock marketplace.

## Features

- **For Pharmacies:**
  - Search and compare drug prices across multiple warehouses.
  - View best offers and discounts.
  - Shopping Cart management.
  - Peer-to-peer Marketplace for dead stock.

- **For Warehouses:**
  - Dashboard to manage sales and orders.
  - Upload daily price lists (PDF/Excel) with AI parsing.
  - Integration simulation with OrgaSoft.

- **For Admins:**
  - Manage registration requests.

## How to Run Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```
    API_KEY=your_google_genai_api_key_here
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

## Deployment

### Netlify Deployment

1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Ensure your default branch is named `main` or update the deployment settings in Netlify to match your branch name (e.g., `master`).
3.  Connect the repository to Netlify.
4.  The `netlify.toml` file included in this project will automatically configure the build settings (`npm run build`) and publish directory (`dist`).

### Troubleshooting

**Error: `git ref refs/heads/main does not exist`**
- This error occurs if you haven't pushed your code to the repository yet, or if your branch is named `master` instead of `main`.
- **Solution:**
  Run the following commands in your terminal to create and push the main branch:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin <your-repo-url>
  git push -u origin main
  ```

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Google Gemini API (for parsing unstructured data and search suggestions)
- Lucide React (Icons)
