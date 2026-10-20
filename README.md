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
VITE_API_URL=http://localhost:8080
```

## Deploy to Netlify

This repository includes `netlify.toml` with the Vite build command, `dist`
publish directory, and SPA route fallback.

1. Import this repository into Netlify.
2. For an interactive preview before the backend is deployed, set
   `VITE_DEMO_MODE` to `true` in Netlify. Demo mode uses sample catalog and
   contact data, and stores demo cart, account, wishlist, orders, and tickets
   only in that browser. The login form accepts any non-empty email and
   password; this does not authenticate against a real service. A visible
   banner marks the preview, and no real orders or support requests are made.
3. For the real application, set `VITE_API_URL` to the publicly reachable
   HTTPS base URL for the backend (for example, `https://api.example.com`).
   Never use `localhost` for a deployed frontend.
4. Deploy with the build command `npm run build` and publish directory `dist`;
   these are already configured in `netlify.toml`.
5. Configure the backend CORS allowlist to include the Netlify site origin.
   If using a custom domain, allow that origin too.
6. Ensure the backend and database are hosted and reachable over HTTPS before
   testing sign-in, product data, checkout, or other API-backed features.

`VITE_API_URL` is embedded in the browser bundle at build time, so set it in
Netlify before deploying or trigger a new deploy after changing it.
