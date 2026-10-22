# SokoChap frontend

React and Vite storefront for SokoChap. The name blends *Soko* (market) and
*ChapChap* (quickly), signaling fast delivery.

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Create a local `.env` file with the API server base URL:

```text
VITE_API_BASE_URL=http://localhost:8080
```

## Deploy to Netlify

This repository includes `netlify.toml` with the Vite build command, `dist`
publish directory, and SPA route fallback.

1. Import this repository into Netlify. The production build is configured to
   use `https://shop-backend-z2fb.onrender.com` through `VITE_API_BASE_URL`.
   To override it in Netlify, set that same key under **Site configuration →
   Environment variables**. Remove `VITE_DEMO_MODE` if it was previously set.
   Never use `localhost` for a deployed frontend.
2. In the Render backend service, set `CORS_ORIGINS` to
   `https://shoplin.netlify.app` and redeploy the backend. The backend must
   allow this exact origin; otherwise browser API requests are rejected even
   when the API works from a direct request.
3. Push frontend changes and deploy with the build command `npm run build` and
   publish directory `dist`; these are already configured in `netlify.toml`.
   Trigger a clear-cache deploy after changing Netlify environment variables.
4. Ensure the backend and database are hosted and reachable over HTTPS before
   testing sign-in, product data, checkout, or other API-backed features.

`VITE_API_BASE_URL` is embedded in the browser bundle at build time, so trigger
a new deploy after changing it. `VITE_API_URL` remains supported as a legacy
alias for existing local configurations.
