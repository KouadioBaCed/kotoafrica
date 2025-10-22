Frontend environment setup (Vite)

1. Copy `.env.development.example` to `.env.development` for local development.
2. Copy `.env.production.example` to `.env.production` for production builds.
3. The frontend reads `VITE_API_BASE_URL` and `VITE_FRONTEND_BASE_URL` via `import.meta.env` and `src/config.ts`.
