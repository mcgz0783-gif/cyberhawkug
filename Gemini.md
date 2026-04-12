# Gemini

This repository uses Vite + React and is deployed as a static single-page application.

## What changed

- Added `vercel.json` for Vercel static deployment configuration.
- Added `deploy` and `vercel-build` npm scripts to support Vercel workflows.
- Reworked `index.html` metadata for search engine indexing, Google crawlers, and social sharing.
- Confirmed that the app currently does not use prerendering plugins; it is built as a client-side Vite SPA.
- Kept `public/robots.txt` open to all crawlers, including Googlebot and Bingbot.

## Vercel deployment

Use these commands:

- `npm install`
- `npm run build`
- `npm run vercel-build`
- `npm run preview`
- `npm run deploy` (requires Vercel CLI via `npx vercel --prod`)

## SEO and crawler support

- `index.html` now includes `robots` and `googlebot` meta directives.
- Added `google-site-verification` placeholder; replace with a real token if you verify the site.
- Included canonical URL and Open Graph metadata.

## Prerender status

This repo currently has no prerender or SSR plugin configured. The app is rendered at runtime in the browser after Vite produces static assets.

If you want true prerendering later, consider adding a Vite prerender plugin or moving to a framework with static site generation.
