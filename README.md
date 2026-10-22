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

### Troubleshooting login and API requests

Vite injects environment variables into the frontend during the Netlify build;
changing a variable in Netlify does not update an already-published bundle.

1. Open `https://shoplin.netlify.app/login`, open browser DevTools (**F12**),
   select **Network**, and submit the login form.
2. Inspect the failed request URL:
   - If it points to `localhost`, the published bundle has a stale or missing
     API URL. In Netlify, confirm `VITE_API_BASE_URL` is
     `https://shop-backend-z2fb.onrender.com` with no trailing slash, then
     choose **Deploys → Trigger deploy → Clear cache and deploy site**. Wait
     until the deploy is published, then hard-refresh the page and retry.
   - If it points to the Render URL and the browser reports a CORS error, set
     `CORS_ORIGINS=https://shoplin.netlify.app` in the Render backend
     environment and redeploy the backend. Confirm the origin is allowed by
     checking the preflight request in Network.
   - An HTTP `401` usually indicates missing or invalid login credentials or
     an expired token. An HTTP `403` can indicate a CORS rejection or that the
     authenticated user is not permitted; inspect the response and console
     message to distinguish them.
3. Confirm catalog requests go to
   `https://shop-backend-z2fb.onrender.com/api/...` and return successful
   responses. The first request can take around a minute if the Render
   free-tier service needs to wake up.
