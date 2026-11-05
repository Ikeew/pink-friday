import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite';
import { createApiHandler } from './server/api.ts';

/** Atende `/api/dashboard` também em `npm run dev` e `npm run preview`. */
function dashboardApi(env: Record<string, string>): Plugin {
  const handleApi = createApiHandler({ url: env['GRONER_API_URL'], token: env['GRONER_API_TOKEN'] });
  const middleware = (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    handleApi(req, res).then((handled) => {
      if (!handled) next();
    }, next);
  };

  return {
    name: 'dashboard-api',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), dashboardApi(loadEnv(mode, process.cwd(), 'GRONER_'))],
}));
