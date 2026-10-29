# Form & Field

A responsive, client-side storefront demo for thoughtfully selected everyday goods. It is built with native JavaScript modules and CSS, so it has no runtime dependencies or build step.

## Run locally

From this directory, start Python's static file server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Features

- Hash-based client-side routes for the home page, collections, product details, and shopping bag.
- Search and category filters, product quick-add, quantity controls, and a bag saved in local storage.
- Responsive layouts, lazy-loaded product photography, optimized Unsplash image requests, and reduced-motion support.
- Static-hosting ready for Netlify, Vercel, or GitHub Pages. No deployment account or checkout integration is configured in this demo.

## Deploy

Connect this directory to a static hosting provider and publish the project root. No build command or output directory is required. The application uses hash-based routes, so direct navigation works without a server-side rewrite.

Product photography is served by Unsplash and the typefaces are served by Google Fonts.
