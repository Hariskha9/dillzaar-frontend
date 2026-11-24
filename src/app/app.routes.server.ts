import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },

  // Static public pages
  {
    path: 'about-us',
    renderMode: RenderMode.Server,
  },
  {
    path: 'contact-us',
    renderMode: RenderMode.Server,
  },

  // Product listing
  {
    path: 'products',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products/:slug',
    renderMode: RenderMode.Server,
  },

  // Product details
  {
    path: 'product/:slug',
    renderMode: RenderMode.Server,
  },

  // Browser-dependent pages
  {
    path: 'cart',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },

  // Admin panel
  {
    path: 'panel/**',
    renderMode: RenderMode.Client,
  },

  // Fallback
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
  
];
